import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
    this._setupRouting();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  _setupRouting() {
    window.addEventListener("hashchange", () => {
      this.renderPage();
    });
    this.renderPage(); // Initial render
  }

  async renderPage() {
    const url = getActiveRoute();
    const token = localStorage.getItem("token");
    const publicRoutes = ["/login", "/register"];
    const hiddenHeaderRoutes = ["/dashboard", "/anak", "/tambah-anak"];

    const header = document.querySelector("header");
    if (header) {
      header.style.display = hiddenHeaderRoutes.includes(url)
        ? "none"
        : "block";
    }

    // Jika belum login dan bukan halaman publik
    if (!token && !publicRoutes.includes(url)) {
      console.log("Redirecting to login...");
      window.location.hash = "/login";
      return;
    }

    const page = routes[url];
    if (!page) {
      this.#content.innerHTML = "<h2>404 - Halaman tidak ditemukan</h2>";
      return;
    }

    try {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    } catch (error) {
      this.#content.innerHTML =
        "<h2>Terjadi kesalahan saat memuat halaman</h2>";
      console.error(error);
    }

    this._updateUIBasedOnLogin();
  }

  _updateUIBasedOnLogin() {
    const token = localStorage.getItem("token");
    const logoutButton = document.getElementById("logoutButton");
    const loginLink = document.getElementById("loginLink");
    const registerLink = document.getElementById("registerLink");
    const homeButton = document.getElementById("homeButton");

    if (logoutButton) {
      logoutButton.style.display = token ? "inline-block" : "none";
      logoutButton.addEventListener("click", () => this.handleLogout());
    }

    if (loginLink) {
      loginLink.style.display = token ? "none" : "inline-block";
    }

    if (registerLink) {
      registerLink.style.display = token ? "none" : "inline-block";
    }

    if (homeButton) {
      homeButton.style.display = token ? "inline-block" : "none";
    }
  }

  handleLogout() {
    localStorage.removeItem("token");
    window.location.hash = "/login";
  }
}
if (window.location.hash !== "#/profile-posyandu") {
  const header = document.querySelector("header");
  if (header) header.style.display = "block";
}

export default App;
