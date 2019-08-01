import $$ from 'dom7';
import { get, set, del } from 'idb-keyval';
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

// Import leaflet JS
import * as L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;

// Workaround for default marker icon
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Import leaflet JS preloader
import 'leaflet-loading/src/Control.Loading.js';
import 'leaflet-loading/src/Control.Loading.css';

// Import leaflet JS gestures for scrolling on object create
import "leaflet/dist/leaflet.css";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import { GestureHandling } from "leaflet-gesture-handling";
L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

// Import leaflet JS icon on global map
// import "leaflet.locatecontrol/dist/L.Control.Locate.min.js";
// import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";

// Import leaflet JS geocoding
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.min.js";

// Simple app config
import * as config from '../config';

var app = new Framework7({
    root: '#app', // App root element
    id: 'io.mobile.trash', // App bundle ID
    name: 'Object b', // App name
    theme: 'auto', // Automatic theme detection

    // App routes
    routes: routes,

    // App root data, can be used for global variables
    data: function () {
        return {
            iconSettings: {
                mapIconUrl: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" version="1.1" viewBox="-12 -12 24 24"><circle r="9" style="stroke:#fff;stroke-width:3;fill:#2A93EE;fill-opacity:1;opacity:1;"></circle></svg>',
            }
        };
    },

    // App root methods
    methods: {
        // https://github.com/apache/cordova-plugin-network-information
        deviceIsOffline: function () {
            // if (app.device.cordova) {
            //     var networkState = navigator.connection.type;

            //     return networkState === Connection.NONE;
            // }

            return !navigator.onLine;
        },
        setApiKeyAsRequestHeader: function (token) {
            app.request.setup({
                // Кастомный заголовок https://github.com/slimphp/Slim/issues/831
                headers: { 'X-Authorization': token }
            });
        },
        errorRequestHandler: function (xhr, status) {
            var message = JSON.parse(xhr.response).error || 'Что-то пошло не так :(';

            console.log(status);

            app.preloader.hide();
            app.dialog.alert(message, function () {
                del('AUTH_TOKEN').then(function () {
                    location.reload();
                });
            });
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
            var url = config.backendPublicUrl + '/api/social';

            facebookConnectPlugin.login(['public_profile', 'email'], function (result) {
                if (typeof result.authResponse.accessToken !== 'undefined') {
                    app.preloader.show();

                    // Добавляем токен, полученный от провайдера
                    app.request.postJSON(url, {
                        provider: 'facebook',
                        access_token: result.authResponse.accessToken
                    }, function (success, status) {
                        console.log(status, success.api_key);

                        set('AUTH_TOKEN', success.api_key).then(function () {
                            app.methods.setApiKeyAsRequestHeader(success.api_key);
                            
                            router.navigate('/objects-list');
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
            var url = config.backendPublicUrl + '/api/social';

            SocialVk.init(config.vkontakteClientId);
            SocialVk.login(['email'], function (result) {
                var jsonObject = JSON.parse(result);

                if (typeof jsonObject.token !== 'undefined') {
                    app.preloader.show();

                    app.request.postJSON(url, {
                        provider: 'vkontakte',
                        access_token: jsonObject.token,
                        email: jsonObject.email
                    }, function (success, status) {
                        console.log(status, success.api_key);

                        set('AUTH_TOKEN', success.api_key).then(function () {
                            app.methods.setApiKeyAsRequestHeader(success.api_key);
                            
                            router.navigate('/objects-list');
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
        onBackKeyDown: function () {
            if (typeof app.popup.get('.popup') === 'undefined' && typeof app.dialog.get() === 'undefined') {
                app.views.current.router.back();
            } else {
                if (typeof app.popup.get('.popup') !== 'undefined') {
                    app.popup.get('.popup').close();
                }

                if (typeof app.dialog.get() !== 'undefined') {
                    app.dialog.close();
                }
            }

            return false;
        },
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
        pageMounted: function (page) {
            page.app.$('#app').show();
        }
    },

    // Global settings
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
    dialog: {
        buttonOk: 'Ок',
        buttonCancel: 'Отмена',
    },
    navbar: {
        iosCenterTitle: false
    },
});

$$('.tab').on('tab:show', function () {
    var $tabEl = $$(this);
    var tabId = $tabEl.attr('id');

    if (tabId === 'view-map') {
        var viewEl = $$('#view-map');
        var viewParams = $$(viewEl).dataset();

        app.views.create(viewEl, viewParams);
    }
});

function onDeviceReady() {
    document.addEventListener("backbutton", app.methods.onBackKeyDown, false);
}

document.addEventListener('deviceready', onDeviceReady, false);