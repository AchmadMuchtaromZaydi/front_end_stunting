import Header from "../components/header.js";
import StepIndicator from "../components/StepIndicator.js";
import { createProfile } from "../../data/profileApi.js";
import "../../../styles/auth.css";

const CreateProfilePage = {
  render() {
    return `
      <section class="form-page">
        <div class="auth-left">
          <img src="/kesehatan.png" alt="SMART Logo" />
          <h2>SMART</h2>
          <p>Stunting Monitoring and Alert Response Tool</p>
        </div>

        <div class="auth-right">
          ${StepIndicator.render(2)}

          <form id="profileForm" class="form-card">
            <h3 style="text-align: center; margin-bottom: 20px;">Buat Profil Posyandu</h3>

            <label for="profilePicture">Upload Foto Posyandu</label>
            <div class="profile-picture-upload">
              <img id="profilePreview" src="https://res.cloudinary.com/dpvj8a3g2/image/upload/v1717865261/default-profile.png" alt="Foto Posyandu" class="preview-foto"/>
              <input type="file" id="profilePicture" accept="image/*" style="display: none;">
              <button type="button" id="uploadButton" class="upload-button">Unggah Foto</button>
              <p id="uploadStatus" style="font-size: 0.85rem; color: #555; margin-top: 5px;"></p>
            </div>

            <label for="posyanduName">Nama Posyandu</label>
            <input id="posyanduName" name="posyanduName" type="text" placeholder="Contoh: Posyandu Melati" required />

            <label for="alamat">Alamat</label>
            <input id="alamat" name="alamat" type="text" placeholder="Contoh: Jl. Kesehatan No.1" required />

            <label for="desa">Desa</label>
            <input id="desa" name="desa" type="text" placeholder="Contoh: Desa Sehat" required />

            <label for="deskripsi">Deskripsi</label>
            <textarea id="deskripsi" name="deskripsi" placeholder="Contoh: Posyandu aktif setiap hari Jumat..." required></textarea>

            <button type="submit" id="submitProfileButton" class="btn-primary btn-save">Simpan Profil</button>
            <p id="profileError" style="color: red; margin-top: 10px;"></p>
            <div id="loadingSpinner" class="spinner" style="display: none; margin-top: 15px;"></div>
          </form>
        </div>
      </section>
    `;
  },

  async afterRender() {
    Header.afterRender();

    const token = localStorage.getItem("token");
    const step2Completed = localStorage.getItem("step2_completed");

    if (!token) {
      window.location.hash = "/login";
      return;
    }

    if (step2Completed === "true") {
      window.location.hash = "/welcome";
      return;
    }

    const form = document.getElementById("profileForm");
    const profilePictureInput = document.getElementById("profilePicture");
    const profilePreview = document.getElementById("profilePreview");
    const uploadButton = document.getElementById("uploadButton");
    const uploadStatus = document.getElementById("uploadStatus");
    const submitProfileButton = document.getElementById("submitProfileButton");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const profileError = document.getElementById("profileError");

    let currentProfileImageUrl =
      "https://res.cloudinary.com/dpvj8a3g2/image/upload/v1717865261/default-profile.png";

    uploadButton.addEventListener("click", () => {
      profilePictureInput.click();
    });

    profilePictureInput.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          profilePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);

        uploadStatus.textContent = "Mengunggah foto... Mohon tunggu.";
        uploadStatus.style.color = "#007b8f";
        uploadButton.disabled = true;
        loadingSpinner.style.display = "block";

        try {
          const imageUrl = await this._uploadPhotoToCloudinary(file);
          currentProfileImageUrl = imageUrl;
          uploadStatus.textContent = "Foto berhasil diunggah.";
          uploadStatus.style.color = "#28a745";
        } catch (error) {
          console.error("Error uploading profile photo:", error);
          uploadStatus.textContent = `Gagal mengunggah foto: ${error.message}`;
          uploadStatus.style.color = "red";
          currentProfileImageUrl =
            "https://res.cloudinary.com/dpvj8a3g2/image/upload/v1717865261/default-profile.png";
          profilePreview.src = currentProfileImageUrl;
        } finally {
          uploadButton.disabled = false;
          loadingSpinner.style.display = "none";
        }
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      profileError.textContent = "";

      const posyanduName = form.posyanduName.value.trim();
      const alamat = form.alamat.value.trim();
      const desa = form.desa.value.trim();
      const deskripsi = form.deskripsi.value.trim();

      if (!posyanduName || !alamat || !desa || !deskripsi) {
        profileError.textContent = "Semua field wajib diisi.";
        return;
      }

      submitProfileButton.disabled = true;
      loadingSpinner.style.display = "block";

      try {
        const profileData = {
          nama_posyandu: posyanduName,
          alamat: `${alamat}, ${desa}`,
          foto_url: currentProfileImageUrl,
          deskripsi: deskripsi,
        };

        await createProfile(token, profileData);
        localStorage.setItem("step2_completed", "true");
        window.location.hash = "/welcome";
      } catch (error) {
        console.error("Error saving profile:", error);
        profileError.textContent = `Terjadi kesalahan: ${error.message}`;
      } finally {
        submitProfileButton.disabled = false;
        loadingSpinner.style.display = "none";
      }
    });
  },

  async _uploadPhotoToCloudinary(file) {
    const CLOUDINARY_CLOUD_NAME = "dydfth7zs";
    const CLOUDINARY_UPLOAD_PRESET = "stunting_anak";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok) {
      throw new Error(
        uploadData.error?.message || "Upload gagal di sisi Cloudinary."
      );
    }

    return uploadData.secure_url;
  },
};

export default CreateProfilePage;
