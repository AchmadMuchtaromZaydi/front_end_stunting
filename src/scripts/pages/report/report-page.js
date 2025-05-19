import Sidebar from '../components/sidebar.js';
import '../../../styles/report.css'; // bikin CSS sendiri kalau belum
import getStatusAnak from '../../data/statusAnakApi.js'; // kita buat di langkah berikutnya

const ReportPage = {
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
          <h2>Report</h2>
          <div class="search-container">
            <input type="text" id="searchInput" placeholder="Search ..." />
            <button id="searchBtn">🔍</button>
          </div>
          <div class="table-container">
            <table class="report-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Alamat</th>
                  <th>Posyandu</th>
                  <th>Umur</th>
                  <th>Tinggi Badan</th>
                  <th>Berat</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody id="reportBody">
                <tr><td colspan="8">Loading...</td></tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    `;
  },

  async afterRender() {
    Sidebar.afterRender();

    // ✅ Sembunyikan header global kalau ada
    const header = document.querySelector('header');
    if (header) header.style.display = 'none';



    const token = localStorage.getItem('token');
    const data = await getStatusAnak(token);

    const tbody = document.getElementById('reportBody');
    if (!data || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8">Data tidak ditemukan.</td></tr>`;
      return;
    }

    tbody.innerHTML = '';
    data.forEach((anak, index) => {
      const umurTahun = Math.floor(anak.umur_bulan / 12);
      const umurBulan = anak.umur_bulan % 12;
      const umurString = umurTahun > 0
        ? `${umurTahun} tahun${umurBulan ? ` ${umurBulan} bulan` : ''}`
        : `${umurBulan} bulan`;

      const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${anak.nama}</td>
          <td>${anak.alamat ?? '-'}</td>
          <td>${anak.posyandu ?? '-'}</td>
          <td>${umurString}</td>
          <td>${anak.tinggi_badan} cm</td>
          <td>${anak.berat_badan} Kg</td>
          <td><span class="status-label ${anak.label.toLowerCase()}">${anak.label}</span></td>
        </tr>
      `;
      tbody.insertAdjacentHTML('beforeend', row);
    });
  }
};

export default ReportPage;
