import Sidebar from '../components/sidebar.js';
import { tambahAnak } from '../../data/anakApi.js';
import '../../../styles/anak.css';

const TambahAnakPage = {
  async render() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.hash = '/login';
      return '';
    }

    return `
      <div class="dashboard-layout">
        ${Sidebar.render()}
        <main class="main-content">
          <div class="form-container">
            <h2>Tambah Data Anak</h2>
            <form id="formTambahAnak" class="form-anak">
              <div class="form-group">
                <label for="foto">Foto</label>
                <div class="file-upload">
                  <input type="file" id="foto" name="foto" accept="image/*" class="file-input" />
                  <label for="foto" class="file-label">Choose File</label>
                  <span class="file-name">No file chosen</span>
                </div>
                <div class="preview-container">
                  <img id="previewFoto" class="preview-foto" />
                </div>
              </div>
              <div class="form-group">
                <label for="nama">Nama</label>
                <input type="text" id="nama" name="nama" placeholder="Masukkan Nama" required />
              </div>
              <div class="form-group">
                <label for="umur">Umur (bulan)</label>
                <input type="number" id="umur" name="umur" placeholder="Masukkan Umur (bulan)" required />
              </div>
              <div class="form-group">
                <label for="tinggi">Tinggi (cm)</label>
                <input type="number" step="0.1" id="tinggi" name="tinggi" placeholder="Masukkan Tinggi (cm)" required />
              </div>
              <div class="form-group">
                <label for="berat">Berat (kg)</label>
                <input type="number" step="0.1" id="berat" name="berat" placeholder="Masukkan Berat (kg)" required />
              </div>
              <div class="form-group">
                <label for="jenis_kelamin">Jenis Kelamin</label>
                <select id="jenis_kelamin" name="jenis_kelamin" required>
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div class="button-container">
                <button type="submit" class="btn-tambah-data">Tambah Data</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    `;
  },

  async afterRender() {
    Sidebar.afterRender();
    const form = document.getElementById('formTambahAnak');
    const token = localStorage.getItem('token');
    const fotoInput = form.querySelector('input[name="foto"]');
    const previewImg = document.getElementById('previewFoto');
    const fileNameSpan = form.querySelector('.file-name');

    let base64Foto = null;

    fotoInput.addEventListener('change', () => {
      const file = fotoInput.files[0];
      if (file) {
        fileNameSpan.textContent = file.name;
        const reader = new FileReader();
        reader.onload = () => {
          base64Foto = reader.result;
          previewImg.src = base64Foto;
        };
        reader.readAsDataURL(file);
      } else {
        fileNameSpan.textContent = 'No file chosen';
        previewImg.src = ''; // Clear preview if no file selected
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      const anakPayload = [{
        nama: formData.get('nama'),
        jenis_kelamin: formData.get('jenis_kelamin'),
        umur_bulan: parseInt(formData.get('umur')),
        tinggi_badan: parseFloat(formData.get('tinggi')),
        berat_badan: parseFloat(formData.get('berat')),
        foto_url: base64Foto || null, // kirim base64 string jika ada
      }];

      try {
        await tambahAnak(token, anakPayload);
        alert('Data anak berhasil ditambahkan!');
        window.location.hash = '/anak';
      } catch (err) {
        alert(err.message);
      }
    });
  }
};

export default TambahAnakPage;