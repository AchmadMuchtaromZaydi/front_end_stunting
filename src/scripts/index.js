import "../styles/styles.css";
import "../styles/sidebar.css";

import Sidebar from "./pages/components/sidebar.js";
import Header from "./pages/components/header.js";
import App from "./pages/app.js";

function renderHeader() {
  const mainHeader = document.getElementById("main-header");
  if (!mainHeader) return;

  const publicRoutes = ["/login", "/register"];
  const activeRoute = window.location.hash.replace("#", "") || "/";
  const isAuthPage = publicRoutes.includes(activeRoute);

  if (isAuthPage) {
    mainHeader.innerHTML = "";
    mainHeader.style.display = "none";
    return;
  }

  mainHeader.innerHTML = Header.render(false);
  Header.afterRender();
  mainHeader.style.display = "flex";
}

function updateSidebar() {
  const publicRoutes = ["/login", "/register"];
  const activeRoute = window.location.hash.replace("#", "") || "/";
  const sidebarContainer = document.getElementById("sidebar-container");
  const sidebarToggle = document.getElementById("sidebar-toggle");

  renderHeader();

  if (publicRoutes.includes(activeRoute)) {
    sidebarContainer.innerHTML = "";
    if (sidebarToggle) sidebarToggle.style.display = "none";
    return;
  }

  sidebarContainer.innerHTML = Sidebar.render();
  Sidebar.afterRender();

  if (window.innerWidth >= 1000) {
    sidebarToggle.style.display = "none";
  } else {
    sidebarToggle.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
  });

  await app.renderPage();
  updateSidebar();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
    updateSidebar();
  });

  window.addEventListener("resize", () => {
    updateSidebar();
  });
});
