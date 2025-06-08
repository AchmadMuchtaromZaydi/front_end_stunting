import Sidebar from "../components/sidebar"; // Sesuaikan path jika berbeda
import ProfilePosyanduPresenter from "./profile-posyandu-presenter";
import "../../../styles/profile-posyandu.css"; // Impor CSS Anda

const ProfilePosyanduPage = {
  async render() {
    console.log("ProfilePosyanduPage: render() berjalan");

    return `
      <div class="app-container">
        ${Sidebar.render("Profil Posyandu")}
        <div class="content" id="profilePosyanduContent">
          </div>
      </div>
    `;
  },

  async afterRender() {
    console.log("ProfilePosyanduPage: afterRender() berjalan");

    // Jika Anda ingin menyembunyikan header global, pastikan elemen 'header' ada di HTML Anda
    const header = document.querySelector("header");
    if (header) header.style.display = "none";

    await ProfilePosyanduPresenter.init({
      contentContainer: document.getElementById("profilePosyanduContent"),
    });
  },
};

export default ProfilePosyanduPage;
