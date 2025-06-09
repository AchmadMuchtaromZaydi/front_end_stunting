import Header from "../components/header.js";
import RegisterPresenter from "./register-presenter.js";
import "../../../styles/auth.css";

const RegisterPage = {
  async render() {
    return `
      ${Header.render()}
      <section class="form-page">
        <form id="registerForm" class="form-card">
          <label for="username">Username</label>
          <input id="username" name="username" type="text" placeholder="Contoh: johndoe" required />

          <label for="password">Password</label>
          <div class="password-wrapper">
            <input id="password" name="password" type="password" placeholder="********" required />
            <span class="toggle-password" data-target="password">👁️</span>
          </div>

          <label for="confirmPassword">Konfirmasi Password</label>
          <div class="password-wrapper">
            <input id="confirmPassword" name="confirmPassword" type="password" placeholder="********" required />
            <span class="toggle-password" data-target="confirmPassword">👁️</span>
          </div>

          <button type="submit" id="submitBtn">Register</button>

          <p>Sudah punya akun? <a href="#/login">Login</a></p>

          <p id="registerError" style="color: red; margin-top: 10px;" aria-live="assertive"></p>
        </form>
      </section>
    `;
  },

  async afterRender() {
    Header.afterRender();

    const form = document.getElementById("registerForm");
    const submitBtn = document.getElementById("submitBtn");
    const errorElem = document.getElementById("registerError");

    if (!form || !errorElem || !submitBtn) {
      console.error("Element form atau error tidak ditemukan");
      return;
    }

    this.presenter = new RegisterPresenter({ view: this });

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

    this.initTogglePassword();
  },

  showError(message) {
    const errorElem = document.getElementById("registerError");
    if (errorElem) {
      errorElem.textContent = message;
    }
  },

  showSuccess(message) {
    alert(message);
  },

  initTogglePassword() {
    document.querySelectorAll(".toggle-password").forEach((icon) => {
      icon.addEventListener("click", () => {
        const targetId = icon.getAttribute("data-target");
        const input = document.getElementById(targetId);
        if (input.type === "password") {
          input.type = "text";
          icon.textContent = "🙈";
        } else {
          input.type = "password";
          icon.textContent = "👁️";
        }
      });
    });
  },
};

export default RegisterPage;
