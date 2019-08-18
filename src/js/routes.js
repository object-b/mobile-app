import WelcomePage from '../pages/app/intro.f7.html';
import ObjectsListPage from '../pages/app/objects-list.f7.html';
import ObjectsMapPage from '../pages/app/objects-map.f7.html';
import RegisterPage from '../pages/app/register.f7.html';
import LoginPage from '../pages/app/login.f7.html';
import ObjectPage from '../pages/app/object.f7.html';
import ObjectsFiltersPage from '../pages/app/objects-filters.f7.html';
import CreateObjectPage from '../pages/app/create-object.f7.html';
import UserProfile from '../pages/app/profile.f7.html';
import NotFoundPage from '../pages/404.f7.html';

import * as auth from '../js/auth';

var authCheck = function (routeTo, routeFrom, resolve, reject) {
    var self = this;

    auth.isAuthenticated().then(function (key) {
        self.view.app.methods.setApiKeyAsRequestHeader(key);

        resolve({ component: ObjectsListPage });
    }).catch(function () {
        resolve({ component: WelcomePage });
    });
};

var routes = [
    {
        path: '/',
        async: authCheck
    },
    {
        path: '/welcome',
        component: WelcomePage,
    },
    {
        path: '/objects-list',
        component: ObjectsListPage
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