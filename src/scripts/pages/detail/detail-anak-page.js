// detail-anak-page.js
import DetailAnakPresenter from "./detail-anak-presenter.js";
import Sidebar from "../components/sidebar.js";
import "../../../styles/detail-anak.css"; // Pastikan file ini ada

const DetailAnakPage = {
  async render() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.hash = "/login";
      return "";
    }

    return `
      <div class="dashboard-layout">
        ${Sidebar.render()}
        <main class="main-content page-detail-anak">
          <div id="detailContainer" class="detail-anak">Memuat data...</div>
        </main>
      </div>
    `;
  },

  async afterRender() {
    Sidebar.afterRender();

    const token = localStorage.getItem("token");
    const anakId = localStorage.getItem("anak_id");
    const container = document.getElementById("detailContainer");

    try {
      const anak = await DetailAnakPresenter.fetchDetailAnak(token, anakId);

      // --- PERBAIKAN DI BAWAH INI ---
      container.innerHTML = `
        <h2>Detail Anak</h2>
        <div class="detail-card">
          <div class="foto-container">
            ${
              anak.foto_url
                ? `<img src="${anak.foto_url}" alt="Foto ${anak.nama}" class="foto-anak-detail" />`
                : '<div class="placeholder-foto-detail">Foto Tidak Tersedia</div>'
            }
          </div>
          <div class="info-detail">
            <p><strong>ID Anak:</strong> <span>${anak.id}</span></p>
            <p><strong>Nama:</strong> <span>${anak.nama}</span></p>
            <p><strong>Jenis Kelamin:</strong> <span>${
              anak.jenis_kelamin
            }</span></p>
            <p><strong>Umur:</strong> <span>${anak.umur_bulan} bulan</span></p>
            <p><strong>Tinggi Badan:</strong> <span>${
              anak.tinggi_badan
            } cm</span></p>
            <p><strong>Berat Badan:</strong> <span>${
              anak.berat_badan
            } kg</span></p>
            <p><strong>Tanggal Cek:</strong> <span>${new Date(
              anak.created_at
            ).toLocaleDateString("id-ID", {
              // Format tanggal lebih ramah
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</span></p>
            <p><strong>Status:</strong> <span class="status ${anak.label
              .toLowerCase()
              .replace(/ /g, "-")}">${anak.label}</span></p>
          </div>
        </div>
        <div class="detail-actions">
          <button id="backButton" class="btn-back">Kembali ke Daftar Anak</button>
          <button id="hapusButton" class="btn-hapus">Hapus Data Anak</button>
        </div>
      `;
      // --- AKHIR PERBAIKAN ---

      // Handle back button
      document.getElementById("backButton").addEventListener("click", () => {
        window.location.hash = "/anak";
      });

      // Ganti tombol dengan clone agar event listener lama hilang
      const originalButton = document.getElementById("hapusButton");
      const newButton = originalButton.cloneNode(true);
      originalButton.parentNode.replaceChild(newButton, originalButton);

      newButton.addEventListener("click", async () => {
        const konfirmasi = confirm(
          `Apakah Anda yakin ingin menghapus data ${anak.nama}?`
        );
        if (!konfirmasi) return;

        try {
          await DetailAnakPresenter.hapusAnak(token, anakId);
          alert("✅ Data berhasil dihapus");
          window.location.hash = "/anak";
        } catch (err) {
          alert(`❌ Gagal menghapus data: ${err.message}`);
        }
      });
    } catch (err) {
      container.innerHTML = `<p class="error" style="text-align: center;">❌ Gagal memuat data: ${err.message}</p>`;
    }
  },
};

export default DetailAnakPage;
