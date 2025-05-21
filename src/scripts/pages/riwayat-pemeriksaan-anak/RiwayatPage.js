import Sidebar from '../components/sidebar.js';
import '../../../styles/report.css'; // kamu bisa ganti nama jika perlu
import getRiwayatAnak from '../../data/riwayat-api.js'; // file API baru

const RiwayatPage = {
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
          <h2>Riwayat Pemeriksaan Anak</h2>
          <div class="table-container">
            <table class="report-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Tanggal</th>
                  <th>Umur</th>
                  <th>Tinggi Badan (cm)</th>
                  <th>Berat Badan (kg)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody id="reportBody">
                <tr><td colspan="6">Loading...</td></tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    `;
  },

  async afterRender() {
    Sidebar.afterRender();

    const header = document.querySelector('header');
    if (header) header.style.display = 'none';

    const token = localStorage.getItem('token');
    const anakId = localStorage.getItem('anak_id'); // pastikan kamu simpan anak_id saat login atau pemilihan anak

    const data = await getRiwayatAnak(anakId, token);

    const tbody = document.getElementById('reportBody');
    if (!data || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6">Data riwayat tidak ditemukan.</td></tr>`;
      return;
    }

    tbody.innerHTML = '';
    data.forEach((riwayat, index) => {
      const umurTahun = Math.floor(riwayat.umur_bulan / 12);
      const umurBulan = riwayat.umur_bulan % 12;
      const umurString = umurTahun > 0
        ? `${umurTahun} tahun${umurBulan ? ` ${umurBulan} bulan` : ''}`
        : `${umurBulan} bulan`;

      const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${new Date(riwayat.tanggal_pemeriksaan).toLocaleDateString()}</td>
          <td>${umurString}</td>
          <td>${riwayat.tinggi_badan}</td>
          <td>${riwayat.berat_badan}</td>
          <td><span class="status-label ${riwayat.status.toLowerCase()}">${riwayat.status}</span></td>
        </tr>
      `;
      tbody.insertAdjacentHTML('beforeend', row);
    });
  }
};

export default RiwayatPage;
