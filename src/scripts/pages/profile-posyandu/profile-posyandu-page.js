import Sidebar from "../components/sidebar";
import ProfilePosyanduPresenter from "./profile-posyandu-presenter";
import "../../../styles/profile-posyandu.css";

const ProfilePosyanduPage = {
  async render() {
    return `
      <div class="app-container">
        ${Sidebar.render("Tentang Posyandu")}
        <div class="content" id="profilePosyanduContent">
          <!-- Konten akan dimuat oleh Presenter -->
        </div>
      </div>
    `;
  },

  async afterRender() {
    // Sembunyikan header hanya untuk halaman ini
    const header = document.querySelector("header");
    if (header) header.style.display = "none";

    ProfilePosyanduPresenter.init({
      contentContainer: document.getElementById("profilePosyanduContent"),
    });
  },
};

export default ProfilePosyanduPage;
