import "../../../styles/sidebar.css";

const Sidebar = {
  render() {
    const activePage = window.location.hash;

    return `
      <nav class="sidebar">
        <div class="top-section">
          <div class="sidebar-logo">
            <img src="kesehatan.png" alt="Logo" class="sidebar-logo-img" />
            <div class="logo-text">
              <strong>SMART</strong><br><small>Stunting Monitoring</small>
            </div>
          </div>
        </div>
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
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.hash = "/login";
    });

    // Auto close sidebar ketika klik link → UX makin mantap:
    const sidebar = document.querySelector(".sidebar");

    sidebar?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        sidebar.classList.remove("open");
      });
    });
  },
};

export default Sidebar;
