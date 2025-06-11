import Header from "../components/header.js";
import StepIndicator from "../components/StepIndicator.js";
import "../../../styles/auth.css";

const CreateProfilePage = {
  render() {
    return `
      <section class="form-page">
        <div class="auth-left">
          <img src="/kesehatan.png" alt="SMART Logo" />
          <h2>SMART</h2>
          <p>Stunting Monitoring and Alert Response Tool</p>
        </div>

        <div class="auth-right">
          ${StepIndicator.render(2)}

          <form id="profileForm" class="form-card">
            <label for="posyanduName">Nama Posyandu</label>
            <input id="posyanduName" name="posyanduName" type="text" placeholder="Contoh: Posyandu Melati" required />

            <label for="alamat">Alamat</label>
            <textarea id="alamat" name="alamat" placeholder="Contoh: Jl. Kesehatan No. 1" required></textarea>

            <label for="desa">Desa</label>
            <input id="desa" name="desa" type="text" placeholder="Contoh: Desa Sehat" required />

            <button type="submit">Simpan Profil</button>
            <p id="profileError" style="color: red; margin-top: 10px;"></p>
          </form>
        </div>
      </section>
    `;
  },

  async afterRender() {
    Header.afterRender();

    const token = localStorage.getItem("token");
    const step2 = localStorage.getItem("step2_completed");
    if (!token) {
      window.location.hash = "/login";
      return;
    }

    if (step2 === "true") {
      window.location.hash = "/welcome";
      return;
    }

    const form = document.getElementById("profileForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const posyanduName = form.posyanduName.value.trim();
      const alamat = form.alamat.value.trim();
      const desa = form.desa.value.trim();

      if (!posyanduName || !alamat || !desa) {
        this.showError("Semua field wajib diisi.");
        return;
      }

      // Simpan step 2 sebagai selesai
      localStorage.setItem("step2_completed", "true");

      // Simulasikan penyimpanan profil (jika pakai API, lakukan fetch POST di sini)

      // Redirect ke step 3 (halaman welcome)
      window.location.hash = "/welcome";
    });
  },

  showError(message) {
    const errorElem = document.getElementById("profileError");
    errorElem.textContent = message;
  },
};

export default CreateProfilePage;
