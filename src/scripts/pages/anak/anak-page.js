import AnakPresenter from './anak-presenter.js';
import Sidebar from '../components/sidebar.js';
import '../../../styles/daftar-anak.css'; // Pastikan path CSS sudah benar

const AnakPage = {
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
          <h2>Daftar Anak</h2>
          <div class="search-wrapper">
            <input type="text" id="searchInput" placeholder="Cari nama anak..." class="search-input" />
            <a href="#/tambah-anak" class="btn-tambah">+ Tambah Anak</a>
          </div>
          <div id="anakList" class="anak-list">Memuat data...</div>
        </main>
      </div>
    `;
  },

  async afterRender() {
    Sidebar.afterRender();

    const token = localStorage.getItem('token');
    const container = document.getElementById('anakList');
    const searchInput = document.getElementById('searchInput');
    let anakList = [];

    try {
      anakList = await AnakPresenter.fetchAnakList(token);
      renderList(anakList);

      searchInput.addEventListener('input', () => {
        const keyword = searchInput.value.toLowerCase();
        const filtered = anakList.filter((anak) =>
          anak.nama.toLowerCase().includes(keyword)
        );
        renderList(filtered);
      });
    } catch (error) {
      container.textContent = error.message;
    }

function renderList(data) {
  if (data.length === 0) {
    container.innerHTML = '<p class="no-data">Tidak ada hasil ditemukan.</p>';
    return;
  }

  container.innerHTML = data
    .map(
      (anak) => `
        <div class="anak-card" data-id="${anak.id}">
          <div class="anak-card-header">
            ${
              anak.foto_url
                ? `<img src="${anak.foto_url}" alt="Foto ${anak.nama}" class="foto-anak" />`
                : '<div class="placeholder-foto"></div>'
            }
            <div class="info-nama-status">
              <h3>${anak.nama}</h3>
              <p class="status ${anak.label.toLowerCase().replace(/ /g, '-')}">
                ${anak.label}
              </p>
            </div>
          </div>
          <div class="anak-details">
            <p><strong>ID Anak:</strong> <span>${anak.id}</span></p>
            <p>Jenis Kelamin: <span>${anak.jenis_kelamin}</span></p>
            <p>Umur: <span>${anak.umur_bulan} bulan</span></p>
            <p>Tinggi Badan: <span>${anak.tinggi_badan} cm</span></p>
            <p>Berat Badan: <span>${anak.berat_badan} kg</span></p>
            <p>Tanggal Data: <span>${new Date(anak.created_at).toLocaleDateString()}</span></p>
          </div>
        </div>
      `
    )
    .join('');

  // Tambahkan event listener setelah HTML dirender
  const cards = document.querySelectorAll('.anak-card');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const anakId = card.getAttribute('data-id');
      localStorage.setItem('anak_id', anakId);
      window.location.hash = '/detail-anak';
    });
  });
}





  },
};

export default AnakPage;
