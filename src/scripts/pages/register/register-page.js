import Header from "../components/header.js";
import RegisterPresenter from "./register-presenter.js";
import StepIndicator from "../components/StepIndicator.js";
import "../../../styles/auth.css";
import CreateProfilePage from "../profile-posyandu/create-profile-posyandu-page.js"; // ✅ WAJIB

const RegisterPage = {
  render() {
    return `
      <section class="form-page">
        <div class="auth-left">
          <img src="/kesehatan.png" alt="SMART Logo" />
          <h2>SMART</h2>
          <p>Stunting Monitoring and Alert Response Tool</p>
        </div>

        <div class="auth-right">
          ${StepIndicator.render(
            1
          )} <!-- Pastikan step indicator memiliki animasi panah -->

          <form id="registerForm" class="form-card">
            <label for="username">Username</label>
            <input id="username" name="username" type="text" placeholder="Contoh: johndoe" required />

            <label for="password">Password</label>
            <div class="password-wrapper">
              <input id="password" name="password" type="password" placeholder="********" required />
              <span class="toggle-password" onclick="showHide(this)">
                <svg xmlns="http://www.w3.org/2000/svg" class="eye-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  <path class="slash-path" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18L18 6" style="display: block;" />
                </svg>
              </span>
            </div>

            <label for="confirmPassword">Konfirmasi Password</label>
            <div class="password-wrapper">
              <input id="confirmPassword" name="confirmPassword" type="password" placeholder="********" required />
              <span class="toggle-password" onclick="showHide(this)">
                <svg xmlns="http://www.w3.org/2000/svg" class="eye-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  <path class="slash-path" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18L18 6" style="display: block;" />
                </svg>
              </span>
            </div>

            <button type="submit" id="submitBtn">Register</button>
            <p>Sudah punya akun? <a href="#/login">Login</a></p>
            <p id="registerError" style="color: red;"></p>
          </form>
        </div>
      </section>
    `;
  },

  async afterRender() {
    const token = localStorage.getItem("token");
    const step1 = localStorage.getItem("step1_completed");
    if (token && step1 === "true") {
      window.location.hash = "/buat-profile";
      return;
    }

    Header.afterRender();
    this.presenter = new RegisterPresenter({ view: this });

    const form = document.getElementById("registerForm");
    const submitBtn = document.getElementById("submitBtn");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = form.username.value.trim();
      const password = form.password.value.trim();
      const confirmPassword = form.confirmPassword.value.trim();
      this.showError("");

      if (!username || !password || !confirmPassword) {
        this.showError("Semua field wajib diisi.");
        return;
      }

      if (password.length < 6) {
        this.showError("Password minimal 6 karakter.");
        return;
      }

      if (password !== confirmPassword) {
        this.showError("Password dan konfirmasi password tidak sama.");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Mendaftarkan...";

      await this.presenter.handleRegister(username, password);

      submitBtn.disabled = false;
      submitBtn.textContent = "Register";
    });

    // Fungsi toggle visibility password (seperti di login)
    window.showHide = function (icon) {
      const input = icon.parentElement.querySelector("input");
      const eyeIconSvg = icon.querySelector(".eye-icon");
      const slashPath = eyeIconSvg.querySelector(".slash-path");

      if (input.type === "password") {
        input.type = "text";
        slashPath.style.display = "none";
      } else {
        input.type = "password";
        slashPath.style.display = "block";
      }
    };
  },

  showError(message) {
    document.getElementById("registerError").textContent = message;
  },

  showSuccess(message) {
    alert(message);
  },
};

export default RegisterPage;
