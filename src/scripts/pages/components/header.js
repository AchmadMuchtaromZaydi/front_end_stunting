import "../../../styles/header.css";

const Header = {
  render() {
    return `
     <header class="main-header">
  <div class="header-logo">
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
    // Jika ada logic klik logo, dsb., bisa ditambahkan di sini.
  },
};

export default Header;
