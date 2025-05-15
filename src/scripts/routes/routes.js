import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import HomePage from '../pages/home/home-page';
import DashboardPage from '../pages/dashboard/dashboard-page.js';


const routes = {
  '/login': LoginPage,
  '/register': RegisterPage,
  '/dashboard': DashboardPage, // ⬅️ Tambahan ini

  '/': HomePage, 
};

export default routes;
