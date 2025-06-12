import Sidebar from "../components/sidebar.js";
import { tambahAnak } from "../../data/anakApi.js";
import "../../../styles/anak.css";

const TambahAnakPage = {
  async render() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.hash = "/login";
      return "";
    }

    return `
      <div class="dashboard-layout">
        ${Sidebar.render()}
        <main class="main-content-anak">
          <div class="form-container">
            <h2>Tambah Data Anak</h2>
            <form id="formTambahAnak" class="form-anak">
              <div class="form-group">
                <label for="fotoFile">Upload Foto Anak</label>
                <input type="file" id="fotoFile" name="fotoFile" accept="image/png, image/jpeg" />
                <div class="preview-container">
                  <img id="previewFoto" class="preview-foto" />
                </div>
                <input type="hidden" id="fotoUrl" name="fotoUrl" value="" />
                <small class="help-text">Ukuran maksimal 2MB. Format JPG, PNG.</small>
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

    const form = document.getElementById("formTambahAnak");
    const token = localStorage.getItem("token");
    const fotoInput = document.getElementById("fotoFile");
    const previewImg = document.getElementById("previewFoto");
    const hiddenFotoUrl = document.getElementById("fotoUrl");

    // Preview foto dan upload ke Cloudinary
    fotoInput.addEventListener("change", async () => {
      const file = fotoInput.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          alert("❌ Ukuran foto maksimal 2MB.");
          fotoInput.value = "";
          previewImg.src = "";
          hiddenFotoUrl.value = "";
          return;
        }

        // Preview
        const reader = new FileReader();
        reader.onload = () => {
          previewImg.src = reader.result;
        };
        reader.readAsDataURL(file);

        // Upload ke Cloudinary
        const cloudForm = new FormData();
        cloudForm.append("file", file);
        cloudForm.append("upload_preset", "stunting");

        try {
          const uploadRes = await fetch(
            "https://api.cloudinary.com/v1_1/dydfth7zs/image/upload",
            {
              method: "POST",
              body: cloudForm,
            }
          );
          const uploadData = await uploadRes.json();
          hiddenFotoUrl.value = uploadData.secure_url;
          console.log("🟢 Upload foto anak sukses:", uploadData.secure_url);
        } catch (err) {
          alert("❌ Gagal mengupload foto ke Cloudinary.");
          hiddenFotoUrl.value = "";
        }
      } else {
        previewImg.src = "";
        hiddenFotoUrl.value = "";
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      const anakPayload = [
        {
          nama: formData.get("nama"),
          jenis_kelamin: formData.get("jenis_kelamin"),
          umur_bulan: parseInt(formData.get("umur")),
          tinggi_badan: parseFloat(formData.get("tinggi")),
          berat_badan: parseFloat(formData.get("berat")),
          foto_url: formData.get("fotoUrl") || null, // ✅ Masukkan foto_url ke payload
        },
      ];

      try {
        const responseData = await tambahAnak(token, anakPayload);

        const fotoUrl = formData.get("fotoUrl");
        if (fotoUrl) {
          const namaAnak = responseData?.nama || formData.get("nama");
          const jenisKelaminAnak =
            responseData?.jenis_kelamin || formData.get("jenis_kelamin");

          const fotoKey = `foto_anak_${namaAnak
            .trim()
            .toLowerCase()}_${jenisKelaminAnak.trim().toLowerCase()}`;
          localStorage.setItem(fotoKey, fotoUrl);
          console.log("🟢 Foto anak disimpan di localStorage:", fotoKey, fotoUrl);
        }

        alert("✅ Data anak berhasil ditambahkan!");
        window.location.hash = "/anak";
      } catch (err) {
        alert(`❌ Gagal menambahkan data anak: ${err.message}`);
      }
    });
  },
};

export default TambahAnakPage;
