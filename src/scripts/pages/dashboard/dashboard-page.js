import Sidebar from '../components/sidebar.js';
import '../../../styles/dashboard.css';
import getStatistik from '../../data/statistikApi.js';
import Chart from 'chart.js/auto';

let chartInstance = null; // untuk simpan instance chart

const DashboardPage = {
  async render() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.hash = '/login';
      return '';
    }

    return `
      <div class="dashboard-layout">
        ${Sidebar.render()}
        <main class="main-content">
          <h2>Dashboard</h2>
          <div class="chart-container">
            <canvas id="stuntingChart"></canvas>
          </div>

          <div class="summary-boxes">
            <div class="summary-box">Daftar Anak Penderita Stunting <span id="stunted-count">...</span></div>
            <div class="summary-box">Daftar Anak Berpotensi Stunting <span id="severely-stunted-count">...</span></div>
            <div class="summary-box">Daftar Anak Normal <span id="normal-count">...</span></div>
          </div>
        </main>
      </div>
    `;
  },

  async afterRender() {
    Sidebar.afterRender();

    const token = localStorage.getItem('token');
    const data = await getStatistik(token);

    if (data) {
      const tahunTerbaru = Object.keys(data).sort().reverse()[0];
      const statistik = data[tahunTerbaru];

      // Tampilkan jumlah ke summary box
      document.getElementById('normal-count').textContent = statistik.Normal;
      document.getElementById('stunted-count').textContent = statistik.Stunted;
      document.getElementById('severely-stunted-count').textContent = statistik['Severely Stunted'];

      // Buat grafik
      const ctx = document.getElementById('stuntingChart').getContext('2d');

      if (chartInstance) {
        chartInstance.destroy();
      }

chartInstance = new Chart(ctx, {
  type: 'line', // 🟢 Ganti jadi LINE
  data: {
    labels: ['Normal', 'Stunted', 'Severely Stunted'],
    datasets: [{
      label: `Statistik Tahun ${tahunTerbaru}`,
      data: [statistik.Normal, statistik.Stunted, statistik['Severely Stunted']],
      fill: false,
      borderColor: '#4caf50',
      backgroundColor: '#4caf50',
      tension: 0.3, // 🔁 Smooth curve (0 = sharp)
      pointRadius: 5,
      pointBackgroundColor: ['#4caf50', '#ff9800', '#f44336'],
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Statistik Anak Berdasarkan Status Gizi (${tahunTerbaru})`
      },
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  }
});

    } else {
      console.warn('Data statistik tidak tersedia atau format salah');
    }
  }
};

export default DashboardPage;
