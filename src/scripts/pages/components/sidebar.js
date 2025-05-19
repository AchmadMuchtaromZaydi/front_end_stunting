
import '../../../styles/sidebar.css';

const Sidebar = {
  render() {
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
          <li><a href="#/dashboard">Dashboard</a></li>
          <li><a href="#/anak">Daftar Anak</a></li>
          <li><a href="#/profile">Profile</a></li>
          <li><a href="#/report">Report</a></li>
          <li><a href="#" id="logoutBtn">Logout</a></li>
        </ul>
        <div class="credit">Cr By: CC25 - CF271</div>
      </nav>
    `;
  },

  afterRender() {
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.hash = '/login';
    });
  }
};

export default Sidebar;
