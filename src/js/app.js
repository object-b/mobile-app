import $$ from 'dom7';
import { get, set } from 'idb-keyval';
import Framework7 from 'framework7/framework7.esm.bundle.js';

// Import F7 Styles
import 'framework7/css/framework7.bundle.css';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/fontawesome.min.css';
import '../css/app.css';

// Import Cordova APIs
import cordovaApp from './cordova-app.js';

// Import Routes
import routes from './routes.js';

// Simple app config
import * as config from '../config';

var app = new Framework7({
    root: '#app', // App root element
    id: 'io.mobile.trash', // App bundle ID
    name: 'Object b', // App name
    theme: 'auto', // Automatic theme detection

    // App root data, can be used for config
    data: function () {
        return {

        };
    },
    // App root methods
    methods: {
        // https://github.com/apache/cordova-plugin-network-information
        deviceIsOffline: function() {
            // if (app.device.cordova) {
            //     var networkState = navigator.connection.type;

            //     return networkState === Connection.NONE;
            // }

            return !navigator.onLine;
        },
        openNotification: function (message) {
            app.toast.create({
                text: message,
                position: 'bottom',
                closeTimeout: 4500,
            }).open();
        },
        socialLoginFacebook: function () {
            var router = app.views.main.router;
            var url = config.backendPublicUrl + '/oauth/token';
            var authData = {
                grant_type: 'social', // static 'social' value
                client_id: config.backendOauthPasswordClientId, // client id
                client_secret: config.backendOauthPasswordClientSecret, // client secret
                provider: 'facebook', // name of provider (e.g., 'facebook', 'google' etc.)
                access_token: '', // access token issued by specified provider
            };

            facebookConnectPlugin.login(['public_profile', 'email'], function (result) {
                if (typeof result.authResponse.accessToken !== 'undefined') {
                    app.preloader.show();

                    // Добавляем токен, полученный от провайдера
                    authData.access_token = result.authResponse.accessToken;

                    app.request.postJSON(url, authData, function (success, status) {
                        // console.log(status, success.access_token);
                        // Авторизационный токен сгенерированный laravel
                        set('AUTH_TOKEN', success.access_token).then(function () {
                            router.navigate('/objects-list');
                            app.preloader.hide();
                        }).catch(function (error) {
                            app.toast.create({
                                text: error,
                                closeTimeout: 4500,
                            }).open();
                        });
                    }, function (error, status) {
                        app.toast.create({
                            text: 'Register error. Code ' + status,
                            closeTimeout: 4500,
                        }).open();

                        app.preloader.hide();
                    });
                }
            }, function (error) {
                // Authenication error callback
                // alert(JSON.stringify(error));
            });
        },
        socialLoginVkontakte: function () {
            var router = app.views.main.router;
            var url = config.backendPublicUrl + '/oauth/token';
            var authData = {
                grant_type: 'social',
                client_id: config.backendOauthPasswordClientId,
                client_secret: config.backendOauthPasswordClientSecret,
                provider: 'vkontakte',
                access_token: '',
            };

            SocialVk.init(config.vkontakteClientId);
            SocialVk.login(['email'], function (result) {
                var jsonObject = JSON.parse(result);

                if (typeof jsonObject.token !== 'undefined') {
                    app.preloader.show();

                    // Добавляем токен, полученный от провайдера
                    authData.access_token = jsonObject.token;
                    // TODO отправлять email вручную из jsonObject.email

                    app.request.postJSON(url, authData, function (success, status) {
                        // console.log(status, success.access_token);
                        // Авторизационный токен сгенерированный laravel
                        set('AUTH_TOKEN', success.access_token).then(function () {
                            router.navigate('/objects-list');
                            app.preloader.hide();
                        }).catch(function (error) {
                            app.toast.create({
                                text: error,
                                closeTimeout: 4500,
                            }).open();
                        });
                    }, function (error, status) {
                        app.toast.create({
                            text: 'Register error. Code ' + status,
                            closeTimeout: 4500,
                        }).open();

                        app.preloader.hide();
                    });
                }
            }, function (error) {
                // Authenication error callback
                // alert(JSON.stringify(error));
            });
        }
    },
    // App routes
    routes: routes,

    // Input settings
    input: {
        scrollIntoViewOnFocus: Framework7.device.cordova && !Framework7.device.electron,
        scrollIntoViewCentered: Framework7.device.cordova && !Framework7.device.electron,
    },
    // Cordova Statusbar settings
    statusbar: {
        overlay: Framework7.device.cordova && Framework7.device.ios || 'auto',
        iosOverlaysWebView: true,
        androidOverlaysWebView: false,
    },
    // Global events
    on: {
        init: function () {
            var f7 = this;
            if (f7.device.cordova) {
                // Init cordova APIs (see cordova-app.js)
                cordovaApp.init(f7);
            }
        },
    },
    navbar: {
        iosCenterTitle: false
    }
});
