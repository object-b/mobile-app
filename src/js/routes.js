import IntroPage from '../pages/app/intro.f7.html';
import ObjectsListPage from '../pages/app/objects-list.f7.html';
import ObjectsMapPage from '../pages/app/objects-map.f7.html';
import RegisterPage from '../pages/app/register.f7.html';
import LoginPage from '../pages/app/login.f7.html';
import NotFoundPage from '../pages/404.f7.html';

var routes = [
  {
    path: '/intro',
    component: IntroPage,
  },
  {
    path: '/objects-list',
    async(routeTo, routeFrom, resolve, reject) {
      if (0) {
        resolve({ component: ObjectsListPage });
      } else {
        resolve({ component: IntroPage });
      }
    }
  },
  {
    path: '/objects-map',
    component: ObjectsMapPage,
  },
  {
    path: '/login',
    component: LoginPage,
  },
  {
    path: '/register',
    component: RegisterPage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;