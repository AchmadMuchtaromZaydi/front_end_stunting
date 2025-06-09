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
    const hiddenHeaderRoutes = [
      "/dashboard",
      "/anak",
      "/tambah-anak",
      "/detail-anak",
    ];

    const header = document.querySelector("header");
    if (header) {
      header.style.display = hiddenHeaderRoutes.includes(url)
        ? "none"
        : "block";
    }

    if (!token && !publicRoutes.includes(url)) {
      console.log("Redirecting to login...");
      window.location.hash = "/login";
      return;
    }

    if (url === "/dashboard") {
      const hasProfile = await this._checkProfile();
      if (!hasProfile) {
        console.log(
          "Redirecting to /profile-posyandu karena belum punya profile..."
        );
        window.location.hash = "/profile-posyandu";
        return;
      }
    }

    const page = routes[url];
    console.log("🔍 URL:", url);
    console.log("🔍 Page object:", page);

    if (!page) {
      this.#content.innerHTML = "<h2>404 - Halaman tidak ditemukan</h2>";
      return;
    }

    if (typeof page.render !== "function") {
      console.error("❌ Page object tidak punya .render()!", page);
      this.#content.innerHTML = "<h2>Page error: render() not found</h2>";
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

      if (response.ok && result.data) {
        console.log("✅ Sudah punya profile");
        return true;
      } else {
        console.log("⚠️ Belum punya profile");
        return false;
      }
    } catch (error) {
      console.error("❌ Error cek profile:", error);
      return false;
    }
  }
}

export default App;
