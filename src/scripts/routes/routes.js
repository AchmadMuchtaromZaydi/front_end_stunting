import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import HomePage from '../pages/home/home-page';
import DashboardPage from '../pages/dashboard/dashboard-page.js';
import AnakPage from '../pages/anak/anak-page.js';
import TambahAnakPage from '../pages/add-anak/tambah-anak-page.js';


const routes = {
  '/login': LoginPage,
  '/register': RegisterPage,
  '/dashboard': DashboardPage,
  '/anak': AnakPage,
  '/tambah-anak': TambahAnakPage, // ⬅️ Tambahan ini

  '/': HomePage, 
};

export default routes;
