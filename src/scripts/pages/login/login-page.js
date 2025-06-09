import Header from "../components/header.js";
import LoginPresenter from "./login-presenter.js";
import "../../../styles/auth.css";

const LoginPage = {
  async render() {
    return `
      ${Header.render()}
      <section class="form-page">
        <form id="loginForm" class="form-card">
          <label for="username">Username</label>
          <input id="username" name="username" type="text" placeholder="Contoh: johndoe" required />

          <label for="password">Password</label>
          <div class="password-wrapper">
            <input id="password" name="password" type="password" placeholder="********" required />
            <span class="toggle-password" data-target="password">👁️</span>
          </div>

          <button type="submit" id="submitBtn">Login</button>

          <p>Belum punya akun? <a href="#/register">Register</a></p>

          <div id="loginLoading" class="spinner" style="display: none; margin-top: 10px;"></div>
          <p id="loginError" style="color: red; margin-top: 10px;" aria-live="assertive"></p>
        </form>
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

      this.showError("");

      if (!username || !password) {
        this.showError("Username dan password tidak boleh kosong.");
        return;
      }

      await this.presenter.handleLogin(username, password);
    });

    this.initTogglePassword();
  },

  showError(message) {
    const errorElem = document.getElementById("loginError");
    if (errorElem) {
      errorElem.textContent = message;
    }
  },

  showLoading() {
    document.getElementById("loginLoading").style.display = "block";
    this.disableForm();
  },

  hideLoading() {
    document.getElementById("loginLoading").style.display = "none";
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

export default LoginPage;
