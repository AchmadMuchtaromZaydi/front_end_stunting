import Sidebar from "../components/sidebar";
import AnakPresenter from "./anak-presenter";
import "../../../styles/daftar-anak.css"; // <--- ini ditambah

const AnakPage = {
  async render() {
    return `
      <div class="app-container">
        ${Sidebar.render("Daftar Anak")}
        <main class="main-content">
          <h2 class="page-title">Daftar Anak</h2>
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

    const token = localStorage.getItem("token");
    const container = document.getElementById("anakList");
    const searchInput = document.getElementById("searchInput");
    let anakList = [];

    try {
      anakList = await AnakPresenter.fetchAnakList(token);
      renderList(anakList);

      searchInput.addEventListener("input", () => {
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
        container.innerHTML =
          '<p class="no-data">Tidak ada hasil ditemukan.</p>';
        return;
      }

      container.innerHTML = data
        .map((anak) => {
          // Ambil foto dari localStorage dengan key yang aman + konsisten
          const fotoLocal = localStorage.getItem(
            `foto_anak_${anak.nama.trim().toLowerCase()}_${anak.jenis_kelamin
              .trim()
              .toLowerCase()}`
          );
          const fotoSrc = fotoLocal || anak.foto_url;

          return `
            <div class="anak-card" data-id="${anak.id}">
              <div class="anak-card-header">
                ${
                  fotoSrc
                    ? `<img src="${fotoSrc}" alt="Foto ${anak.nama}" class="foto-anak" />`
                    : '<div class="placeholder-foto"></div>'
                }
                <div class="info-wrapper">
                  <div class="info-nama-status">
                    <h3>${anak.nama}</h3>
                    <p class="status ${anak.label
                      .toLowerCase()
                      .replace(/ /g, "-")}">
                      ${anak.label}
                    </p>
                  </div>
                  <div class="anak-details">
                    <p>Jenis Kelamin: <span>${anak.jenis_kelamin}</span></p>
                    <p>Tanggal Data: <span>${new Date(
                      anak.created_at
                    ).toLocaleDateString()}</span></p>
                  </div>
                </div>
              </div>
            </div>
          `;
        })
        .join("");

      const cards = document.querySelectorAll(".anak-card");
      cards.forEach((card) => {
        card.addEventListener("click", () => {
          const anakId = card.getAttribute("data-id");
          localStorage.setItem("anak_id", anakId);
          window.location.hash = "/detail-anak";
        });
      });
    }
  },
};

export default AnakPage;
