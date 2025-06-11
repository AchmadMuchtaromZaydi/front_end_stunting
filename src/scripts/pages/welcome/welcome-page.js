import StepIndicator from "../components/StepIndicator.js";
import "../../../styles/auth.css";

const WelcomePage = {
  render() {
    return `
      <section class="form-page">
        <div class="auth-left">
          <img src="/kesehatan.png" alt="SMART Logo" />
          <h2>SMART</h2>
          <p>Stunting Monitoring and Alert Response Tool</p>
        </div>

        <div class="auth-right">
          ${StepIndicator.render(3)}

          <div class="form-card welcome-content">
            <h2>Selamat Datang 🎉</h2>
            <p>Anda telah berhasil menyelesaikan proses pendaftaran dan pembuatan profil Posyandu.</p>
            <p>Tekan tombol di bawah ini untuk masuk ke halaman utama dan mulai menggunakan aplikasi.</p>
            <button id="lanjutBtn" class="btn-primary">Lanjutkan ke Beranda</button>
          </div>
        </div>
      </section>
    `;
  },

  async afterRender() {
    // 🚫 Sembunyikan header
    const header = document.getElementById("main-header");
    if (header) {
      header.innerHTML = "";
      header.style.display = "none";
    }

    const btn = document.getElementById("lanjutBtn");
    btn.addEventListener("click", () => {
      localStorage.setItem("step3_completed", "true");
      window.location.hash = "/dashboard";
    });
  },
};

export default WelcomePage;
