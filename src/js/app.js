/*
 * Сторонние зависимости
 */
import $$ from 'dom7';
import Framework7 from 'framework7/framework7.esm.bundle.js';
import 'framework7/css/framework7.bundle.css';
import * as L from "leaflet";

// Leaflet JS preloader
import 'leaflet-loading/src/Control.Loading.js';
import 'leaflet-loading/src/Control.Loading.css';

// Leaflet JS gestures
import "leaflet/dist/leaflet.css";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import { GestureHandling } from "leaflet-gesture-handling";
L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

// Leaflet JS locate control
import "leaflet.locatecontrol/dist/L.Control.Locate.min.js";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";

// Leaflet JS geocoding
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.min.js";

// Leaflet JS markers on map
import "leaflet.markercluster/dist/leaflet.markercluster.js";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

/*
 * Файлы приложения
 */
import '../css/icons.css';
import '../css/fontawesome.min.css';
import '../css/app.css';
import * as config from '../config';
import * as auth from './auth';
import cordovaApp from './cordova-app.js';
import routes from './routes.js';

delete L.Icon.Default.prototype._getIconUrl;

// Workaround for default marker icon
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// refactor me
window.isOnline = true;

var app = new Framework7({
    root: '#app', // App root element
    id: 'io.mobile.trash', // App bundle ID
    name: 'Где мусорка', // App name
    theme: 'auto',

    // Маршруты (урлы)
    routes: routes,

    // Глобальные кастомные переменные, ну или константы, как удобнее
    // Можно получать доступ из страниц так self.$root.config или app.data.config
    data: function () {
        return {
            config: config.default,
            iconSettings: { mapIconUrl: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" version="1.1" viewBox="-12 -12 24 24"><circle r="9" style="stroke:#fff;stroke-width:3;fill:#2A93EE;fill-opacity:1;opacity:1;"></circle></svg>' },
            defaultMapCenter: [54.318584, 48.397823], // Ульяновск
            locateControlOptions: {
                icon: Framework7.device.ios ? 'f7-icons' : 'material-icons',
                iconLoading: 'fas fa-spinner fa-spin',
                onLocationError: function () { },
                showCompass: false,
                strings: {
                    title: '',
                    popup: 'Вы в радиусе {distance} м. от этой точки',
                },
                locateOptions: {
                    maxZoom: 16,
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 20000,
                    watch: false,
                }
            },
        };
    },

    // Глобальные кастомные методы, могут быть использованы как хелперы
    // Можно получать доступ из страниц так self.$root.openNotification или app.methods.openNotification
    methods: {
        // Используется для загрузки и отображения слоев листов на карте.
        // https://leafletjs.com/reference-1.5.0.html#tilelayer
        createMapTiles: function () {
            return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" class="external">OpenStreetMap</a> contributors'
            });

            // return L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            //     maxZoom: 18,
            //     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/" class="external">OpenStreetMap</a> contributors, ' +
            //         '<a href="https://creativecommons.org/licenses/by-sa/2.0/" class="external">CC-BY-SA</a>, ' +
            //         'Imagery © <a href="https://www.mapbox.com/" class="external">Mapbox</a>',
            //     id: 'mapbox.streets'
            // });
        },
        setApiKeyAsRequestHeader: function (token) {
            app.request.setup({
                // Кастомный заголовок https://github.com/slimphp/Slim/issues/831
                headers: { 'X-Authorization': token }
            });
        },
        handleRequestError: function (xhr, status) {
            var message = JSON.parse(xhr.response).error;

            config.debug && console.log(xhr, status);

            app.preloader.hide();
            app.dialog.alert(message, function () {
                auth.logoutUser().then(function () {
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
            var url = config.socialiteUrl;

            facebookConnectPlugin.login(['public_profile', 'email'], function (result) {
                if (typeof result.authResponse.accessToken !== 'undefined') {
                    // Добавляем токен, полученный от провайдера
                    app.preloader.show();
                    app.request.postJSON(url, {
                        provider: 'facebook',
                        access_token: result.authResponse.accessToken
                    }, function (success, status) {
                        config.debug && console.log(success, status);

                        auth.authenticateUser(success).then(function () {
                            app.methods.setApiKeyAsRequestHeader(success.api_key);

                            router.navigate('/objects-list');
                        });
                    }, function (xhr, status) {
                        app.toast.create({
                            text: 'Register error. Code ' + status,
                            closeTimeout: 4500,
                        }).open();

                        config.debug && console.log(xhr, status);
                    });
                }
            }, function (error) {
                config.debug && console.log(error);
            });
        },
        socialLoginVkontakte: function () {
            var router = app.views.main.router;
            var url = config.socialiteUrl;

            SocialVk.init(config.vkontakteClientId);
            SocialVk.login(['email'], function (result) {
                var jsonObject;

                if (app.device.android) {
                    jsonObject = JSON.parse(result);
                }

                if (app.device.ios) {
                    jsonObject = result;
                }

                if (typeof jsonObject.token !== 'undefined') {
                    app.preloader.show();
                    app.request.postJSON(url, {
                        provider: 'vkontakte',
                        access_token: jsonObject.token,
                        email: jsonObject.email
                    }, function (success, status) {
                        config.debug && console.log(success, status);

                        auth.authenticateUser(success).then(function () {
                            app.methods.setApiKeyAsRequestHeader(success.api_key);

                            router.navigate('/objects-list');
                        });
                    }, function (xhr, status) {
                        app.toast.create({
                            text: 'Register error. Code ' + status,
                            closeTimeout: 4500,
                        }).open();

                        config.debug && console.log(xhr, status);
                    });
                }
            }, function (error) {
                config.debug && console.log(error);
            });
        },
        onBackKeyDown: function () {
            config.debug && console.log(app.views);

            var f7 = this;
            var $ = this.$;

            if ($('.modal-in').length && $('.modal-in')[0].f7Modal) {
                $('.modal-in')[0].f7Modal.close();
                return;
            }

            if ($('.panel-active').length) {
                f7.panel.close();
                return;
            }

            f7.views.main.router.back();
        },
    },

    // Глобальные события F7
    on: {
        init: function () {
            var f7 = this;
            if (f7.device.cordova) {
                cordovaApp.init(f7);
            }
        },
    },

    // Глобальные настройки для компонентов F7
    input: {
        scrollIntoViewOnFocus: Framework7.device.cordova && !Framework7.device.electron,
        scrollIntoViewCentered: Framework7.device.cordova && !Framework7.device.electron,
    },
    statusbar: {
        overlay: Framework7.device.cordova && Framework7.device.ios || 'auto',
        iosOverlaysWebView: true,
        androidOverlaysWebView: false,
    },
    dialog: {
        buttonOk: 'Ок',
        buttonCancel: 'Отмена',
    },
    view: {
        iosDynamicNavbar: false,
    },
});

app.request.setup({
    // beforeSend: function (xhr) {
    // },
    complete: function (xhr, status) {
        app.preloader.hide();

        // Обработчик ошибок только для апи
        // Для реквестов на логин или регистрацию есть свои обработчики в pages/app
        if (
            status === 401 &&
            typeof xhr.requestParameters.headers['X-Authorization'] !== 'undefined'
        ) {
            var message = JSON.parse(xhr.response).error;

            config.debug && console.log(xhr, status);

            app.dialog.alert(message, function () {
                auth.logoutUser().then(function () {
                    location.reload();
                });
            });
        }
    }
});

// $$(document).on('click', '.title', function () {
$$(document).on('deviceready', function () {
    //
});

$$(document).on('backbutton', function () {
    app.methods.onBackKeyDown();
});

$$(document).on('click', '[href="#view-map"]', function () {
    var viewEl = $$('#view-map');
    var viewParams = $$(viewEl).dataset();

    if (typeof app.views.get(viewEl) === 'undefined') {
        app.views.create(viewEl, viewParams);
    }
});

$$(document).on('click', '[href="#view-profile"]', function () {
    var viewEl = $$('#view-profile');
    var viewParams = $$(viewEl).dataset();

    if (typeof app.views.get(viewEl) === 'undefined') {
        app.views.create(viewEl, viewParams);
    }
});

$$(document).on('offline', function () {
    if (!window.isOnline) return;

    window.isOnline = false;

    alert('я офлайн');
}, false);

$$(document).on('online', function () {
    if (window.isOnline) return;

    window.isOnline = true;

    alert('я онлайн');
}, false);