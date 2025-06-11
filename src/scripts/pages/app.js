import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";

class App {
  #content = null;

  constructor({ content }) {
    this.#content = content;
    this._setupRouting();
  }

  _setupRouting() {
    window.addEventListener("hashchange", () => {
      this.renderPage();
    });
    this.renderPage();
  }

  async renderPage() {
    const url = getActiveRoute();
    const token = localStorage.getItem("token");
    const publicRoutes = ["/login", "/register"];

    if (!token && !publicRoutes.includes(url)) {
      window.location.hash = "/login";
      return false;
    }

    if (url === "/dashboard") {
      const hasProfile = await this._checkProfile();
      if (!hasProfile) {
        window.location.hash = "/profile-posyandu";
        return false;
      }
    }

    const page = routes[url];
    if (!page || typeof page.render !== "function") {
      this.#content.innerHTML = "<h2>404 - Halaman tidak ditemukan</h2>";
      return true;
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
    return true;
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

  async _checkProfile() {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const response = await fetch(
        "https://backend-stunting.onrender.com/api/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      return response.ok && result.data;
    } catch (error) {
      console.error("❌ Error cek profile:", error);
      return false;
    }
  }
}

export default App;