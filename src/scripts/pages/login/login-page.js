import Header from "../components/header.js";
import LoginPresenter from "./login-presenter.js";
import "../../../styles/auth.css";

const LoginPage = {
  render() {
    return `
    <section class="form-page">
      <div class="auth-left">
        <img src="/kesehatan.png" alt="SMART Logo" />
        <h2>SMART</h2>
        <p>Stunting Monitoring and Alert Response Tool</p>
      </div>

      <div class="auth-right">
        <form id="loginForm" class="form-card">
          <label for="username">Username</label>
          <input id="username" type="text" placeholder="Contoh: johndoe" required />

          <label for="password">Password</label>
          <div class="password-wrapper">
            <input id="password" type="password" placeholder="Password" required />
            <span class="toggle-password" onclick="showHide(this)">
              <svg xmlns="http://www.w3.org/2000/svg" class="eye-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <!-- Path for the center circle of the eye -->
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <!-- Path for the main eye shape -->
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                <!-- New path for the slash/line-through effect -->
                <path class="slash-path" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M6 18L18 6" style="display: none;" />
              </svg>
            </span>
          </div>

          <button type="submit">Login</button>
          <div id="loginLoading" class="spinner" style="display: none; margin-top: 10px;"></div>
          <p>Belum punya akun? <a href="#/register">Register</a></p>
          <p id="loginError" style="color: red; margin-top: 10px;"></p>
        </form>
      </div>
    </section>
    `;
  },

  async afterRender() {
    Header.afterRender();
    this.presenter = new LoginPresenter({ view: this });

    const form = document.getElementById("loginForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = form.username.value.trim();
      const password = form.password.value.trim();

      this.showError(""); // Clear previous errors

      if (!username || !password) {
        this.showError("Username dan password tidak boleh kosong.");
        return;
      }

      await this.presenter.handleLogin(username, password);
    });

    // Function to toggle password visibility and eye icon slash
    window.showHide = function (icon) {
      const input = icon.parentElement.querySelector("input");
      const eyeIconSvg = icon.querySelector(".eye-icon");
      const slashPath = eyeIconSvg.querySelector(".slash-path"); // Get the slash path

      if (input.type === "password") {
        input.type = "text";
        slashPath.style.display = "none"; // Hide the slash when password is visible
      } else {
        input.type = "password";
        slashPath.style.display = "block"; // Show the slash when password is hidden
      }
    };
  },

  showError(message) {
    const errorElem = document.getElementById("loginError");
    if (errorElem) errorElem.textContent = message;
  },

  showLoading() {
    const loading = document.getElementById("loginLoading");
    if (loading) loading.style.display = "block";
    this.disableForm();
  },

  hideLoading() {
    const loading = document.getElementById("loginLoading");
    if (loading) loading.style.display = "none";
    this.enableForm();
  },

  disableForm() {
    const form = document.getElementById("loginForm");
    form
      .querySelectorAll("input, button")
      .forEach((el) => (el.disabled = true));
  },

  enableForm() {
    const form = document.getElementById("loginForm");
    form
      .querySelectorAll("input, button")
      .forEach((el) => (el.disabled = false));
  },
};

export default LoginPage;
