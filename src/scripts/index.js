import "../styles/styles.css";
import "../styles/responsive.css";
import "../styles/sidebar.css";

import Sidebar from "./pages/components/sidebar.js";
import App from "./pages/app.js";

function updateSidebar() {
  const publicRoutes = ["/login", "/register"];
  const activeRoute = window.location.hash.replace("#", "") || "/";

  const sidebarContainer = document.getElementById("sidebar-container");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const mainHeader = document.getElementById("main-header"); // 🆕 tambahkan ini

  if (publicRoutes.includes(activeRoute)) {
    sidebarContainer.innerHTML = "";
    if (sidebarToggle) sidebarToggle.style.display = "none";

    // Sembunyikan header di halaman login/register
    if (mainHeader) mainHeader.style.display = "none";
  } else {
    sidebarContainer.innerHTML = Sidebar.render();
    Sidebar.afterRender();

    // Show toggle button only on mobile
    if (window.innerWidth >= 1000) {
      sidebarToggle.style.display = "none";
    } else {
      sidebarToggle.style.display = "block";
    }

    // 🆕 Tampilkan header NAVBAR style di mobile
    if (mainHeader) {
      if (window.innerWidth < 1000) {
        mainHeader.style.display = "flex"; // Flex → biar mirip navbar
        mainHeader.innerHTML = `
          <div class="mobile-navbar">
            <img src="kesehatan.png" alt="Logo" class="mobile-logo" />
            <span class="mobile-title">SMART Stunting Monitoring</span>
          </div>
        `;
      } else {
        mainHeader.style.display = "none";
        mainHeader.innerHTML = ""; // Kosongkan kembali di desktop
      }
    }

    // Bind ulang click sidebarToggle setelah render
    const newSidebarToggle = document.getElementById("sidebar-toggle");
    const sidebar = document.querySelector(".sidebar");

    newSidebarToggle?.addEventListener("click", (event) => {
      event.stopPropagation();

      if (window.innerWidth >= 1000) return;

      console.log("👉 Toggle clicked");

      if (sidebar?.classList.contains("open")) {
        sidebar.classList.remove("open");
        newSidebarToggle.style.display = "block"; // Tampilkan tombol kembali
      } else {
        sidebar.classList.add("open");
        newSidebarToggle.style.display = "none"; // Sembunyikan tombol saat sidebar open
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  updateSidebar();

  const app = new App({
    content: document.querySelector("#main-content"),
  });
  await app.renderPage();

  // Auto close sidebar jika klik di luar → hanya mobile
  document.body.addEventListener("click", (event) => {
    const sidebar = document.querySelector(".sidebar");
    const sidebarToggle = document.getElementById("sidebar-toggle");

    if (
      window.innerWidth < 1000 &&
      sidebar?.classList.contains("open") &&
      !sidebar.contains(event.target) &&
      !sidebarToggle.contains(event.target)
    ) {
      sidebar.classList.remove("open");
      sidebarToggle.style.display = "block"; // Tampilkan tombol kembali saat sidebar close
    }
  });

  // On hashchange → update sidebar & render page
  window.addEventListener("hashchange", async () => {
    updateSidebar();
    await app.renderPage();
  });

  // On resize → update visibility of sidebarToggle + header
  window.addEventListener("resize", () => {
    updateSidebar();
  });
});
