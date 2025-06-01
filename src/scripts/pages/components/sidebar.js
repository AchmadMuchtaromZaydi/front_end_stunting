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
          }">Daftar Anak</a></li>
          <li><a href="#/profile" class="${
            activePage === "#/profile" ? "active" : ""
          }">Profile</a></li>
          <li><a href="#/report" class="${
            activePage === "#/report" ? "active" : ""
          }">Report</a></li>
          <li>
            <a href="#/profile-posyandu" class="${
              activePage === "#/profile-posyandu" ? "active" : ""
            }">
              <i class="fa-solid fa-circle-info"></i>
              Tentang Posyandu
            </a>
          </li>
          <li><a href="#" id="logoutBtn">Logout</a></li>
        </ul>
        <div class="credit">Cr By: CC25 - CF271</div>
      </nav>
    `;
  },

  afterRender() {
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.hash = "/login";
    });
  },
};

export default Sidebar;
