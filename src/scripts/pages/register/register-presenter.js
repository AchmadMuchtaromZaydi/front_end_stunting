import { register } from '../../data/api.js';

export default class RegisterPresenter {
  constructor({ view }) {
    this.view = view;
  }

  async handleRegister(username, password) {
    try {
      const result = await register({ username, password });
      this.view.showSuccess('Registrasi berhasil! Silakan login.');
      window.location.hash = '/login';
    } catch (error) {
      const message = error?.message || 'Registrasi gagal. Silakan coba lagi.';
      this.view.showError(message);
    }
  }
}
