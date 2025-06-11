import "../../../styles/sidebar.css";

const Sidebar = {
  render() {
    const activePage = window.location.hash;

    return `
      <div class="overlay" id="overlay"></div>
      <nav class="sidebar" id="sidebar">
        <div class="top-section"></div>
        <ul class="nav-links">
          <li><a href="#/dashboard" class="${
            activePage === "#/dashboard" ? "active" : ""
          }">Dashboard</a></li>
          <li><a href="#/anak" class="${
            activePage === "#/anak" ? "active" : ""
          }">Anak</a></li>
          <li><a href="#/tambah-anak" class="${
            activePage === "#/tambah-anak" ? "active" : ""
          }">Tambah Anak</a></li>
          <li><a href="#/profile-posyandu" class="${
            activePage === "#/profile-posyandu" ? "active" : ""
          }">Profile</a></li>
          <li><a href="#" id="logoutBtn">Logout</a></li>
        </ul>
        <div class="credit">Website Stunting © 2025</div>
      </nav>
    `;
  },

  afterRender() {
    const sidebar = document.getElementById("sidebar");
    const burgerButton = document.getElementById("sidebar-toggle");
    const overlay = document.getElementById("overlay");

    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.hash = "/login";
    });

    sidebar?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        sidebar.classList.remove("open");
        overlay?.classList.remove("show");
        if (window.innerWidth < 1000 && burgerButton) {
          burgerButton.style.display = "block";
        }
      });
    });

    burgerButton?.addEventListener("click", (event) => {
      event.stopPropagation();
      if (window.innerWidth >= 1000) return;
      sidebar.classList.add("open");
      overlay?.classList.add("show");
      burgerButton.style.display = "none";
    });

    overlay?.addEventListener("click", () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("show");
      if (window.innerWidth < 1000 && burgerButton) {
        burgerButton.style.display = "block";
      }
    });
  },
};

export default Sidebar;
