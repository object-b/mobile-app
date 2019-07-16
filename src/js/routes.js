import IntroPage from '../pages/intro.jsx';
import ObjectListPage from '../pages/object-list.jsx';
import ObjectMapPage from '../pages/object-map.jsx';
import RegisterPage from '../pages/register-screen';
import LoginPage from '../pages/login-screen';
import NotFoundPage from '../pages/demo/404.jsx';

import auth from '../api/auth.js';

var routes = [
  {
    path: '/intro',
    component: IntroPage,
  },
  {
    path: '/object-list',
    async: function (routeTo, routeFrom, resolve, reject) {
      console.log(auth.isAuthenticated())
      if (auth.isAuthenticated()) {
        resolve({ component: ObjectListPage })
      } else {
        resolve({ component: IntroPage })
      }
    },
  },
  {
    path: '/object-map',
    component: ObjectMapPage,
  },
  {
    path: '/register',
    component: RegisterPage,
  },
  {
    path: '/login',
    component: LoginPage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
  // {
  //   path: '/map',
  //   component: MapPage,
  // },
  // {
  //   path: '/dynamic-route/blog/:blogId/post/:postId/',
  //   component: DynamicRoutePage,
    // on: {
    //   pageBeforeIn: function (event, page) {
    //       // do something before page gets into the view
    //       console.log(auth.isAuthenticated(), page, this);
          
    //       if (auth.isAuthenticated()) {
            
    //       }
    //   },
    //   pageInit: function (event, page) {
    //       // do something when page initialized
    //       // app.methods.checklogin();
    //   },
    // },
  // },
  // {
  //   path: '/request-and-load/user/:userId/',
  //   async: function (routeTo, routeFrom, resolve, reject) {
  //     // Router instance
  //     var router = this;

  //     // App instance
  //     var app = router.app;

  //     // Show Preloader
  //     app.preloader.show();

  //     // User ID from request
  //     var userId = routeTo.params.userId;

  //     // Simulate Ajax Request
  //     setTimeout(function () {
  //       // We got user data from request
  //       var user = {
  //         firstName: 'Vladimir',
  //         lastName: 'Kharlampidi',
  //         about: 'Hello, i am creator of Framework7! Hope you like it!',
  //         links: [
  //           {
  //             title: 'Framework7 Website',
  //             url: 'http://framework7.io',
  //           },
  //           {
  //             title: 'Framework7 Forum',
  //             url: 'http://forum.framework7.io',
  //           },
  //         ]
  //       };
  //       // Hide Preloader
  //       app.preloader.hide();

  //       // Resolve route to load page
  //       resolve(
  //         {
  //           component: RequestAndLoad,
  //         },
  //         {
  //           context: {
  //             user: user,
  //           }
  //         }
  //       );
  //     }, 1000);
  //   },
  // },
];

export default routes;
