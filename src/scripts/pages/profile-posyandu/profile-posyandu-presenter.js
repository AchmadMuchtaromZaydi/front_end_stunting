const ProfilePosyanduPresenter = {
  init({ contentContainer }) {
    this._contentContainer = contentContainer;
    this._renderContent();
  },

  _renderContent() {
    this._contentContainer.innerHTML = `
      <div class="profile-posyandu">
        <div class="content-wrapper">
          <img src="images/profile-posyandu.jpg" alt="Posyandu Image" class="profile-image" />
          <div class="company-info">
            <h2 class="title">About the Company</h2>
            <p class="description">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat.
              In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor.
              Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere.
              Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
            </p>
            <p class="description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas vitae eligendi voluptatem unde corrupti odit. 
              Ratione corporis beatae error deserunt dolores similique officia laudantium, officiis et sint a. 
              Necessitatibus recusandae architecto fuga assumenda odio enim, dignissimos ipsum doloribus aut consectetur doloremque beatae fugiat. 
              Suscipit ab asperiores voluptate eaque unde impedit!
            </p>
          </div>

          <footer class="footer">
            <div class="footer-section">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Mobile</a>
            </div>
            <div class="footer-section">
              <h4>Contact</h4>
              <a href="#">Help/FAQ</a>
              <a href="#">Press</a>
              <a href="#">Affiliates</a>
            </div>
            <div class="footer-section">
              <h4>More</h4>
              <a href="#">Airline Fees</a>
              <a href="#">Airline</a>
              <a href="#">Low Fare Tips</a>
            </div>
          </footer>
        </div>
      </div>
    `;
  },
};

export default ProfilePosyanduPresenter;
