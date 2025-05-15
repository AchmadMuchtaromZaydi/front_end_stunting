import { register } from '../../data/api.js';
import RegisterPresenter from './register-presenter.js';
import '../../../styles/auth.css';

const RegisterPage = {
  async render() {
    return `
      <section class="form-page">
        <form id="registerForm" class="form-card">
          <label for="username">Username</label>
          <input id="username" name="username" type="text" placeholder="Contoh: johndoe" required />

          <label for="password">Password</label>
          <input id="password" name="password" type="password" placeholder="********" required />

          <button type="submit" id="submitBtn">Register</button>

          <p>Sudah punya akun? <a href="#/login">Login</a></p>

          <p id="registerError" style="color: red; margin-top: 10px;" aria-live="assertive"></p>
        </form>
      </section>
    `;
  },

  async afterRender() {
    const form = document.getElementById('registerForm');
    const submitBtn = document.getElementById('submitBtn');
    const errorElem = document.getElementById('registerError');

    if (!form || !errorElem || !submitBtn) {
      console.error('Element form atau error tidak ditemukan');
      return;
    }

    this.presenter = new RegisterPresenter({ view: this });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = form.username.value.trim();
      const password = form.password.value.trim();

      // Bersihkan pesan error sebelumnya
      this.showError('');

      // Validasi dasar
      if (!username || !password) {
        this.showError('Username dan password tidak boleh kosong.');
        return;
      }

      if (password.length < 6) {
        this.showError('Password minimal 6 karakter.');
        return;
      }

      // Tampilkan loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Mendaftarkan...';

      await this.presenter.handleRegister(username, password);

      // Kembalikan tombol seperti semula
      submitBtn.disabled = false;
      submitBtn.textContent = 'Register';
    });
  },

  showError(message) {
    const errorElem = document.getElementById('registerError');
    if (errorElem) {
      errorElem.textContent = message;
    }
  },

  showSuccess(message) {
    alert(message);
  }
};

export default RegisterPage;
