import CONFIG from "../../config";

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

        this._contentContainer.innerHTML = `
          <div class="profile-posyandu">
            <h2>Profil Posyandu</h2>
            <img src="${
              foto_url && foto_url.trim() !== ""
                ? foto_url
                : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
            }" 
              alt="Foto Posyandu" class="posyandu-photo" />
            <div class="profile-info">
              <div class="profile-key">Nama Posyandu</div>
              <div class="profile-colon">:</div>
              <div class="profile-value">${nama_posyandu}</div>

              <div class="profile-key">Alamat</div>
              <div class="profile-colon">:</div>
              <div class="profile-value">${alamat}</div>

             <div class="profile-key">Deskripsi</div>
             <div class="profile-colon">:</div>
             <div class="profile-value">
                  ${deskripsi ? deskripsi.replace(/\n/g, "<br>") : "-"}
             </div>

            <button id="editProfileBtn" class="btn-primary">Edit Profil</button>
          </div>
        `;

        document
          .getElementById("editProfileBtn")
          .addEventListener("click", () => {
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
      <h2>Profil Posyandu</h2>
      <form id="createProfileForm">
        <h3>Lengkapi Data Profil Posyandu</h3>
        <div id="formMessage"></div>

        <label for="nama_posyandu">Nama Posyandu</label>
        <input type="text" name="nama_posyandu" id="nama_posyandu" required />

        <label for="alamat">Alamat</label>
        <input type="text" name="alamat" id="alamat" required />

        <label for="deskripsi">Deskripsi</label>
        <textarea name="deskripsi" id="deskripsi"></textarea>

        <label for="foto_url">URL Foto Posyandu (Opsional)</label>
        <input type="url" name="foto_url" id="foto_url" />

        <div>
          <button type="submit" class="btn-primary btn-save">Simpan Profil</button>
        </div>
      </form>
    </div>
  `;

    document
      .getElementById("createProfileForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = {
          nama_posyandu: form.nama_posyandu.value,
          alamat: form.alamat.value,
          deskripsi: form.deskripsi.value,
          foto_url: form.foto_url.value,
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
              window.location.hash = "/dashboard";
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
        <input type="text" name="nama_posyandu" id="nama_posyandu" value="${nama_posyandu}" required />

        <label for="alamat">Alamat</label>
        <input type="text" name="alamat" id="alamat" value="${alamat}" required />

        <label for="deskripsi">Deskripsi</label>
        <textarea name="deskripsi" id="deskripsi">${deskripsi || ""}</textarea>

        <label for="foto_url">URL Foto Posyandu (Opsional)</label>
        <input type="url" name="foto_url" id="foto_url" value="${
          foto_url || ""
        }" />

        <div>
          <button type="submit" class="btn-primary btn-save">Simpan Perubahan</button>
          <button type="button" id="cancelEditBtn" class="btn-primary btn-cancel">Batal</button>
        </div>
      </form>
    </div>
  `;

    document
      .getElementById("editProfileForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = {
          nama_posyandu: form.nama_posyandu.value,
          alamat: form.alamat.value,
          deskripsi: form.deskripsi.value,
          foto_url: form.foto_url.value,
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
              await this._renderContent();
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
