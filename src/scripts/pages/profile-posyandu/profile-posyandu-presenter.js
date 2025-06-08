import CONFIG from "../../config";
import DOMPurify from "dompurify"; // Impor DOMPurify

const ProfilePosyanduPresenter = {
  async init({ contentContainer }) {
    this._contentContainer = contentContainer;
    await this._renderContent();
  },

  async _renderContent() {
    const token = localStorage.getItem("token");
    if (!token) {
      this._contentContainer.innerHTML =
        "<p>❌ Token tidak ditemukan. Silakan login kembali.</p>";
      return;
    }

    try {
      const response = await fetch(`${CONFIG.BASE_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.data) {
        const { nama_posyandu, alamat, foto_url, deskripsi } = result.data;

        // Sanitasi data sebelum ditampilkan
        // DOMPurify.sanitize secara default akan menghapus tag script dan atribut event handler
        const sanitizedNamaPosyandu = DOMPurify.sanitize(nama_posyandu || "");
        const sanitizedAlamat = DOMPurify.sanitize(alamat || "");
        // Untuk URL, penting untuk sanitasi agar tidak ada JS injection di src
        const sanitizedFotoUrl = DOMPurify.sanitize(foto_url || "");
        // Untuk deskripsi, kita izinkan <br> jika memang berasal dari newline,
        // tapi pastikan semua tag HTML berbahaya lainnya disanitasi.
        // DOMPurify akan membersihkan tag <br> jika tidak diizinkan secara eksplisit,
        // jadi kita lakukan replace setelah sanitasi dasar.
        const sanitizedDeskripsi = DOMPurify.sanitize(deskripsi || "");
        const formattedDeskripsi = sanitizedDeskripsi.replace(/\n/g, "<br>");

        this._contentContainer.innerHTML = `
          <div class="profile-posyandu">
            <h2>Profil Posyandu</h2>
            <img src="${
              sanitizedFotoUrl && sanitizedFotoUrl.trim() !== ""
                ? sanitizedFotoUrl
                : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
            }"
              alt="Foto Posyandu" class="posyandu-photo" />
            <div class="profile-info">
              <div class="profile-key">Nama Posyandu</div>
              <div class="profile-colon">:</div>
              <div class="profile-value">${sanitizedNamaPosyandu}</div>

              <div class="profile-key">Alamat</div>
              <div class="profile-colon">:</div>
              <div class="profile-value">${sanitizedAlamat}</div>

             <div class="profile-key">Deskripsi</div>
             <div class="profile-colon">:</div>
             <div class="profile-value">
                  ${formattedDeskripsi || "-"}
             </div>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <button id="editProfileBtn" class="btn-primary btn-animated">Edit Profil</button>
            </div>
          </div>
        `;

        document
          .getElementById("editProfileBtn")
          .addEventListener("click", () => {
            // Kirim nilai asli (tanpa sanitasi DOMPurify) ke form edit,
            // karena form akan diisi dengan data asli, bukan versi HTML-escaped.
            this._renderEditForm({
              nama_posyandu,
              alamat,
              foto_url,
              deskripsi,
            });
          });
      } else {
        this._renderCreateForm();
      }
    } catch (error) {
      console.error("❌ Error mengambil profile:", error);
      this._contentContainer.innerHTML =
        "<p>❌ Terjadi kesalahan saat mengambil data profil.</p>";
    }
  },

  _renderCreateForm() {
    const token = localStorage.getItem("token");

    this._contentContainer.innerHTML = `
    <div class="profile-posyandu">
      <h2>Buat Profil Posyandu</h2>
      <form id="createProfileForm">
        <h3>Lengkapi Data Profil Posyandu</h3>
        <div id="formMessage"></div>

        <label for="create_nama_posyandu">Nama Posyandu</label>
        <input type="text" name="nama_posyandu" id="create_nama_posyandu" placeholder="Misal: Posyandu Melati" required />

        <label for="create_alamat">Alamat</label>
        <input type="text" name="alamat" id="create_alamat" placeholder="Contoh: Jl. Raya 123, Kel. Sukamaju, Kec. Jaya" required />

        <label for="create_deskripsi">Deskripsi</label>
        <textarea name="deskripsi" id="create_deskripsi" placeholder="Deskripsikan secara singkat tentang Posyandu Anda (visi, misi, layanan utama)"></textarea>

        <label for="create_foto_url">URL Foto Posyandu (Opsional)</label>
        <input type="url" name="foto_url" id="create_foto_url" placeholder="Contoh: https://gambar.com/posyandu_melati.jpg" />

        <div style="text-align: center; margin-top: 20px;">
          <button type="submit" class="btn-primary btn-animated">Buat Profil</button>
        </div>
      </form>
    </div>
    `;

    document
      .getElementById("createProfileForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        // Sanitasi data sebelum dikirim ke server (praktik yang baik, meskipun sanitasi utama ada saat menampilkan)
        // Sanitasi di sini juga untuk mencegah data berbahaya disimpan di database.
        const data = {
          nama_posyandu: DOMPurify.sanitize(form.nama_posyandu.value),
          alamat: DOMPurify.sanitize(form.alamat.value),
          deskripsi: DOMPurify.sanitize(form.deskripsi.value),
          foto_url: DOMPurify.sanitize(form.foto_url.value),
        };

        try {
          const postResponse = await fetch(`${CONFIG.BASE_URL}/api/profile`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          const postResult = await postResponse.json();

          if (postResponse.ok) {
            document.getElementById("formMessage").innerHTML = `
            <div class="success-message">✅ Profil berhasil dibuat!</div>
          `;
            setTimeout(() => {
              // Mungkin lebih baik kembali ke halaman profil setelah pembuatan berhasil
              window.location.hash = "/profile-posyandu"; // Atau rute yang sesuai
            }, 1500);
          } else {
            alert(`❌ Gagal: ${postResult.message}`);
          }
        } catch (error) {
          console.error("❌ Error membuat profile:", error);
          alert("Terjadi kesalahan.");
        }
      });
  },

  _renderEditForm({ nama_posyandu, alamat, foto_url, deskripsi }) {
    const token = localStorage.getItem("token");

    this._contentContainer.innerHTML = `
    <div class="profile-posyandu">
      <h2>Edit Profil Posyandu</h2>
      <form id="editProfileForm">
        <h3>Perbarui Data Profil Posyandu</h3>
        <div id="formMessage"></div>

        <label for="nama_posyandu">Nama Posyandu</label>
        <input type="text" name="nama_posyandu" id="nama_posyandu" value="${
          nama_posyandu || ""
        }" placeholder="Misal: Posyandu Melati" required />

        <label for="alamat">Alamat</label>
        <input type="text" name="alamat" id="alamat" value="${
          alamat || ""
        }" placeholder="Contoh: Jl. Raya 123, Kel. Sukamaju, Kec. Jaya" required />

        <label for="deskripsi">Deskripsi</label>
        <textarea name="deskripsi" id="deskripsi" placeholder="Deskripsikan secara singkat tentang Posyandu Anda (visi, misi, layanan utama)">${
          deskripsi || ""
        }</textarea>

        <label for="foto_url">URL Foto Posyandu (Opsional)</label>
        <input type="url" name="foto_url" id="foto_url" value="${
          foto_url || ""
        }" placeholder="Contoh: https://gambar.com/posyandu_melati.jpg" />

        <div style="text-align: center; margin-top: 20px;">
          <button type="submit" class="btn-primary btn-save">Simpan Perubahan</button>
          <button type="button" id="cancelEditBtn" class="btn-secondary">Batal</button>
        </div>
      </form>
    </div>
  `;

    document
      .getElementById("editProfileForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        // Sanitasi data sebelum dikirim ke server
        const data = {
          nama_posyandu: DOMPurify.sanitize(form.nama_posyandu.value),
          alamat: DOMPurify.sanitize(form.alamat.value),
          deskripsi: DOMPurify.sanitize(form.deskripsi.value),
          foto_url: DOMPurify.sanitize(form.foto_url.value),
        };

        try {
          const putResponse = await fetch(`${CONFIG.BASE_URL}/api/profile`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          const putResult = await putResponse.json();

          if (putResponse.ok) {
            document.getElementById("formMessage").innerHTML = `
            <div class="success-message">✅ Profil berhasil diperbarui!</div>
          `;
            setTimeout(async () => {
              await this._renderContent(); // Render ulang konten profil setelah update
            }, 1500);
          } else {
            alert(`❌ Gagal: ${putResult.message}`);
          }
        } catch (error) {
          console.error("❌ Error mengupdate profile:", error);
          alert("Terjadi kesalahan.");
        }
      });

    document
      .getElementById("cancelEditBtn")
      .addEventListener("click", async () => {
        await this._renderContent();
      });
  },
};

export default ProfilePosyanduPresenter;
