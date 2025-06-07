import DetailAnakPresenter from './detail-anak-presenter.js';
import Sidebar from '../components/sidebar.js';
import '../../../styles/detail-anak.css'; // Pastikan file ini ada

const DetailAnakPage = {
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
          <div id="detailContainer" class="detail-anak">Memuat data...</div>
        </main>
      </div>
    `;
  },

  async afterRender() {
    Sidebar.afterRender();

    const token = localStorage.getItem('token');
    const anakId = localStorage.getItem('anak_id');
    const container = document.getElementById('detailContainer');

    try {
      const anak = await DetailAnakPresenter.fetchDetailAnak(token, anakId);

      container.innerHTML = `
        <h2>Detail Anak</h2>
        <div class="detail-card">
          <div class="foto-container">
            ${
              anak.foto_url
                ? `<img src="${anak.foto_url}" alt="Foto ${anak.nama}" class="foto-anak-detail" />`
                : '<div class="placeholder-foto-detail"></div>'
            }
          </div>
          <div class="info-detail">
            <p><strong>ID Anak:</strong> ${anak.id}</p>
            <p><strong>Nama:</strong> ${anak.nama}</p>
            <p><strong>Jenis Kelamin:</strong> ${anak.jenis_kelamin}</p>
            <p><strong>Umur:</strong> ${anak.umur_bulan} bulan</p>
            <p><strong>Tinggi Badan:</strong> ${anak.tinggi_badan} cm</p>
            <p><strong>Berat Badan:</strong> ${anak.berat_badan} kg</p>
            <p><strong>Status:</strong> <span class="status ${anak.label.toLowerCase().replace(/ /g, '-')}">${anak.label}</span></p>
            <p><strong>Tanggal:</strong> ${new Date(anak.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <button id="hapusButton" class="btn-hapus">Hapus Data Anak</button>
      `;

      // Ganti tombol dengan clone agar event listener lama hilang
      const originalButton = document.getElementById('hapusButton');
      const newButton = originalButton.cloneNode(true);
      originalButton.replaceWith(newButton);

      newButton.addEventListener('click', async () => {
        const konfirmasi = confirm(`Apakah kamu yakin ingin menghapus data ${anak.nama}?`);
        if (!konfirmasi) return;

        try {
          await DetailAnakPresenter.hapusAnak(token, anakId);
          alert('✅ Data berhasil dihapus');
          window.location.hash = '/anak';
        } catch (err) {
          alert(`❌ Gagal menghapus data: ${err.message}`);
        }
      });

    } catch (err) {
      container.innerHTML = `<p class="error">❌ ${err.message}</p>`;
    }
  },
};

export default DetailAnakPage;
