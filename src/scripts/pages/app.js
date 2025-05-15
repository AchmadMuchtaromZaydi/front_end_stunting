import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
    this._setupRouting();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  // Setup routing dan event listener untuk perubahan hash
  _setupRouting() {
    window.addEventListener('hashchange', () => {
      this.renderPage();
    });
    this.renderPage(); // Memanggil render pertama kali ketika halaman dimuat
  }

  async renderPage() {
    const url = getActiveRoute();
    const token = localStorage.getItem('token');
    const publicRoutes = ['/login', '/register'];

    const header = document.querySelector('header');
    if (url === '/dashboard') {
      if (header) header.style.display = 'none';
    } else {
      if (header) header.style.display = 'block';
    }


    // Jika token tidak ada dan halaman bukan login/register, arahkan ke login
    if (!token && !publicRoutes.includes(url)) {
      console.log('Redirecting to login...');
      window.location.hash = '/login';
      return;
    }

    const page = routes[url];
    if (!page) {
      this.#content.innerHTML = '<h2>404 - Halaman tidak ditemukan</h2>';
      return;
    }

    try {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    } catch (error) {
      // Menangani error jika terjadi saat render atau afterRender
      this.#content.innerHTML = '<h2>Terjadi kesalahan saat memuat halaman</h2>';
      console.error(error);
    }

    this._updateUIBasedOnLogin();  // Perbarui UI setelah halaman selesai dirender
  }

  _updateUIBasedOnLogin() {
    const token = localStorage.getItem('token');
    const logoutButton = document.getElementById('logoutButton');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const homeButton = document.getElementById('homeButton');

    // Menyembunyikan atau menampilkan tombol logout dan link login/register
    if (logoutButton) {
      logoutButton.style.display = token ? 'inline-block' : 'none';
      logoutButton.addEventListener('click', () => this.handleLogout());
    }

    if (loginLink) {
      loginLink.style.display = token ? 'none' : 'inline-block';
    }

    if (registerLink) {
      registerLink.style.display = token ? 'none' : 'inline-block';
    }

    // Menampilkan tombol home setelah login
    if (homeButton) {
      homeButton.style.display = token ? 'inline-block' : 'none';
    }
  }

  // Fungsi untuk menangani logout
  handleLogout() {
    // Menghapus token dari localStorage
    localStorage.removeItem('token');
    // Redirect ke halaman login
    window.location.hash = '/login';
  }
}

export default App;
