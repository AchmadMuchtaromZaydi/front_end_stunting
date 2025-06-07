import Sidebar from "../components/sidebar";
import ProfilePosyanduPresenter from "./profile-posyandu-presenter";
import "../../../styles/profile-posyandu.css";

const ProfilePosyanduPage = {
  async render() {
    console.log("ProfilePosyanduPage: render() berjalan");

    return `
      <div class="app-container">
        ${Sidebar.render("Profil Posyandu")}
        <div class="content" id="profilePosyanduContent">
          <!-- Konten akan dimuat oleh Presenter -->
        </div>
      </div>
    `;
  },

  async afterRender() {
    console.log("ProfilePosyanduPage: afterRender() berjalan");

    const header = document.querySelector("header");
    if (header) header.style.display = "none";

    await ProfilePosyanduPresenter.init({
      contentContainer: document.getElementById("profilePosyanduContent"),
    });
  },
};

export default ProfilePosyanduPage;
