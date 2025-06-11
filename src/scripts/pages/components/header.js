import "../../../styles/header.css";

const Header = {
  render(isAuthPage = false) {
    if (isAuthPage) {
      return `
        <header class="main-header auth-header">
          <img src="kesehatan.png" alt="Logo" class="auth-logo" />
        </header>
      `;
    }

    return `
      <header class="main-header">
        <div class="header-logo" onclick="window.location.hash = '/dashboard'">
          <img src="kesehatan.png" alt="Logo" />
          <div class="header-logo-text">
            <strong>SMART</strong>
            <small>Stunting Monitoring</small>
          </div>
        </div>
      </header>
    `;
  },

  afterRender() {
    // Optional events
  },
};

export default Header;
