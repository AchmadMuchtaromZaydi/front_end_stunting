import routes from "../routes/routes.js";
import { getActivePathname } from "../routes/url-parser.js";
import Sidebar from "./components/sidebar.js";
import Header from "./components/header.js";
import { protectRoute } from "../utils/auth-guard.js";

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
    const path = getActivePathname(); // "/dashboard", "/welcome", dsb

    // ✅ Middleware proteksi route
    const redirectPath = protectRoute(path);
    if (redirectPath) {
      window.location.hash = redirectPath;
      return;
    }

    const page = routes[path] || routes["/"];
    if (!page || typeof page.render !== "function") {
      this.#content.innerHTML = "<h2>404 - Halaman tidak ditemukan</h2>";
      return;
    }

    try {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    } catch (error) {
      this.#content.innerHTML =
        "<h2>Terjadi kesalahan saat memuat halaman</h2>";
      console.error("Render error:", error);
    }

    this._updateNavigationUI();
  }

  _updateNavigationUI() {
    const currentRoute = window.location.hash.replace("#", "") || "/";
    const publicRoutes = ["/login", "/register", "/welcome", "/buat-profile"];
    const isPublic = publicRoutes.includes(currentRoute);
    const step3Completed = localStorage.getItem("step3_completed") === "true";

    const mainHeader = document.getElementById("main-header");
    const sidebarContainer = document.getElementById("sidebar-container");
    const sidebarToggle = document.getElementById("sidebar-toggle");

    // ===== HEADER =====
    if (mainHeader) {
      if (isPublic || !step3Completed) {
        mainHeader.innerHTML = "";
        mainHeader.style.display = "none";
      } else {
        mainHeader.innerHTML = Header.render();
        Header.afterRender();
        mainHeader.style.display = "flex";
      }
    }

    // ===== SIDEBAR =====
    if (sidebarContainer) {
      if (isPublic || !step3Completed) {
        sidebarContainer.innerHTML = "";
        if (sidebarToggle) sidebarToggle.style.display = "none";
      } else {
        sidebarContainer.innerHTML = Sidebar.render();
        Sidebar.afterRender();

        if (window.innerWidth >= 1000) {
          sidebarToggle.style.display = "none";
        } else {
          sidebarToggle.style.display = "block";
        }
      }
    }
  }

  handleLogout() {
    ["token", "step1_completed", "step2_completed", "step3_completed"].forEach(
      (k) => localStorage.removeItem(k)
    );
    window.location.hash = "/login";
    location.reload(); // 💥 Force reset UI dan state
  }
}

export default App;