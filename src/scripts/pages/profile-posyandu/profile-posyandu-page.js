import ProfilePosyanduPresenter from "./profile-posyandu-presenter";
import "../../../styles/profile-posyandu.css";

const ProfilePosyanduPage = {
  async render() {
    return `
      <section class="profile-posyandu">
        <div id="profilePosyanduContainer"></div>
      </section>
    `;
  },

  async afterRender() {
    await ProfilePosyanduPresenter.init(this);
  },

  renderProfile({ nama_posyandu, alamat, foto_url, deskripsi }) {
    const defaultFotoUrl =
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";

    console.log("🟢 renderProfile -> foto_url:", foto_url); // log bantu debug

    const container = document.getElementById("profilePosyanduContainer");
    container.innerHTML = `
      <h2>Profile Posyandu</h2>
      <img src="${
        foto_url?.trim() ? foto_url : defaultFotoUrl
      }" alt="Posyandu Photo" class="posyandu-photo" />
      <div class="profile-info">
        <div class="profile-key">Nama Posyandu</div><div class="profile-colon">:</div><div class="profile-value">${nama_posyandu}</div>
        <div class="profile-key">Alamat</div><div class="profile-colon">:</div><div class="profile-value">${alamat}</div>
        <div class="profile-key">Deskripsi</div><div class="profile-colon">:</div><div class="profile-value">${
          deskripsi || "-"
        }</div>
      </div>
      <button id="editProfileBtn" class="btn-warning">Edit Profile</button>
    `;

    document.getElementById("editProfileBtn")?.addEventListener("click", () => {
      this.renderEditForm({ nama_posyandu, alamat, foto_url, deskripsi });
    });
  },

  renderCreateForm() {
    const container = document.getElementById("profilePosyanduContainer");
    container.innerHTML = `
      <h2>Buat Profile Posyandu</h2>
      <form id="createProfileForm">
        <label for="namaPosyandu">Nama Posyandu</label>
        <input type="text" id="namaPosyandu" name="namaPosyandu" required />

        <label for="alamat">Alamat</label>
        <input type="text" id="alamat" name="alamat" required />

        <label for="fotoFile">Upload Foto Posyandu</label>
        <input type="file" id="fotoFile" name="fotoFile" accept="image/png, image/jpeg" />
        <div class="preview-container">
          <img id="previewFoto" class="preview-foto" />
        </div>
        <input type="hidden" id="fotoUrl" name="fotoUrl" value="" />

        <label for="deskripsi">Deskripsi</label>
        <textarea id="deskripsi" name="deskripsi" required></textarea>

        <button type="submit" class="btn-primary btn-save">Simpan Profile</button>
      </form>
    `;

    this._setupFotoUpload();

    document
      .getElementById("createProfileForm")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const fotoUrlValue = document.getElementById("fotoUrl").value;
        if (!fotoUrlValue) {
          alert(
            "❌ Harap upload foto Posyandu terlebih dahulu dan tunggu hingga selesai."
          );
          return;
        }

        const profileData = {
          nama_posyandu: document.getElementById("namaPosyandu").value,
          alamat: document.getElementById("alamat").value,
          foto_url: fotoUrlValue,
          deskripsi: document.getElementById("deskripsi").value,
        };

        await ProfilePosyanduPresenter.saveProfile(profileData);

        window.location.hash = "/dashboard";
      });
  },

  renderEditForm({ nama_posyandu, alamat, foto_url, deskripsi }) {
    const container = document.getElementById("profilePosyanduContainer");
    container.innerHTML = `
      <h2>Edit Profile Posyandu</h2>
      <form id="editProfileForm">
        <label for="namaPosyandu">Nama Posyandu</label>
        <input type="text" id="namaPosyandu" name="namaPosyandu" value="${nama_posyandu}" required />

        <label for="alamat">Alamat</label>
        <input type="text" id="alamat" name="alamat" value="${alamat}" required />

        <label for="fotoFile">Upload Foto Posyandu</label>
        <input type="file" id="fotoFile" name="fotoFile" accept="image/png, image/jpeg" />
        <div class="preview-container">
          <img id="previewFoto" class="preview-foto" src="${foto_url || ""}" />
        </div>
        <input type="hidden" id="fotoUrl" name="fotoUrl" value="${
          foto_url || ""
        }" />

        <label for="deskripsi">Deskripsi</label>
        <textarea id="deskripsi" name="deskripsi" required>${
          deskripsi || ""
        }</textarea>

        <button type="submit" class="btn-primary btn-save">Simpan Perubahan</button>
        <button type="button" id="cancelEditBtn" class="btn-secondary">Batal</button>
      </form>
    `;

    this._setupFotoUpload();

    document
      .getElementById("editProfileForm")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const profileData = {
          nama_posyandu: document.getElementById("namaPosyandu").value,
          alamat: document.getElementById("alamat").value,
          foto_url: document.getElementById("fotoUrl").value,
          deskripsi: document.getElementById("deskripsi").value,
        };

        await ProfilePosyanduPresenter.updateProfile(profileData);
      });

    document
      .getElementById("cancelEditBtn")
      .addEventListener("click", async () => {
        await ProfilePosyanduPresenter.init(this);
      });
  },

  _setupFotoUpload() {
    const fotoInput = document.getElementById("fotoFile");
    const previewImg = document.getElementById("previewFoto");
    const hiddenFotoUrl = document.getElementById("fotoUrl");

    fotoInput.addEventListener("change", async () => {
      const file = fotoInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          previewImg.src = reader.result;
        };
        reader.readAsDataURL(file);

        const cloudForm = new FormData();
        cloudForm.append("file", file);
        cloudForm.append("upload_preset", "stunting_anak");

        try {
          const uploadRes = await fetch(
            "https://api.cloudinary.com/v1_1/dydfth7zs/image/upload",
            {
              method: "POST",
              body: cloudForm,
            }
          );
          const uploadData = await uploadRes.json();

          console.log("🟢 Upload foto sukses:", uploadData.secure_url); // log bantu debug

          hiddenFotoUrl.value = uploadData.secure_url;
        } catch (err) {
          alert("❌ Gagal mengupload foto ke Cloudinary.");
          hiddenFotoUrl.value = "";
        }
      } else {
        previewImg.src = "";
        hiddenFotoUrl.value = "";
      }
    });
  },
};

export default ProfilePosyanduPage;
