import { login } from '../../data/api.js';

export default class LoginPresenter {
  constructor({ view }) {
    this.view = view;
  }

  async handleLogin(username, password) {
    try {
      this.view.showLoading();

      const data = await login({ username, password });

      // Simpan token ke localStorage (gunakan key 'token' untuk konsistensi)
      localStorage.setItem('token', data.loginResult.token);

      // Redirect ke halaman utama
      window.location.hash = '/';
    } catch (error) {
      this.view.showError(error.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      this.view.hideLoading();
    }
  }
}
