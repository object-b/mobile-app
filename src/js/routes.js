import IntroPage from '../pages/app/intro.f7.html';
import ObjectsListPage from '../pages/app/objects-list.f7.html';
import ObjectsMapPage from '../pages/app/objects-map.f7.html';
import RegisterPage from '../pages/app/register.f7.html';
import LoginPage from '../pages/app/login.f7.html';
import ObjectPage from '../pages/app/object.f7.html';
import ObjectsFiltersPage from '../pages/app/objects-filters.f7.html';
import CreateObjectPage from '../pages/app/create-object.f7.html';
import UserProfile from '../pages/app/profile.f7.html';
import NotFoundPage from '../pages/404.f7.html';

import { get, set } from 'idb-keyval';

var routes = [
    {
        path: '/intro',
        component: IntroPage,
    },
    {
        path: '/objects-list',
        async(routeTo, routeFrom, resolve, reject) {
            // проверка на авторизацию пользователя
            get('AUTH_TOKEN').then(value => {
                if (typeof value !== 'undefined') {
                    this.view.app.methods.setApiKeyAsRequestHeader(value);

                    resolve({
                        component: ObjectsListPage
                    });
                } else {
                    resolve({
                        component: IntroPage
                    });
                }
            });
        }
    },
    {
        path: '/object/:objectId',
        component: ObjectPage,
    },
    {
        path: '/objects-filters',
        component: ObjectsFiltersPage,
    },
    {
        path: '/create-object',
        component: CreateObjectPage,
    },
    {
        path: '/objects-map',
        component: ObjectsMapPage,
    },
    {
        path: '/profile',
        component: UserProfile,
    },
    {
        path: '/login',
        component: LoginPage,
    },
    {
        path: '/register',
        component: RegisterPage,
    },
    // Default route (404 page). MUST BE THE LAST
    {
        path: '(.*)',
        component: NotFoundPage,
    },
];

export default routes;