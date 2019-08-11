var successCall;
var failureCall;
var needPermissionMessage = 'У приложения недостаточно прав. Перейти в настройки?';
var needLocationMessage = 'Определение локации отключено. Перейти в настройки?';

export function init(success, failure) {
    failureCall = failure;
    successCall = success;

    requestLocationAccuracy();
}

export function openSettings() {
    if (cordova.platformId === "android") {
        cordova.plugins.diagnostic.switchToLocationSettings();
    } else {
        cordova.plugins.diagnostic.switchToSettings();
    }
}

function onError(error) {
    console.error(error);
    // alert(error);

    failureCall(error);
}

function onSuccess() {
    successCall();
}

export function checkState($) {
    console.log("Checking location state...");

    cordova.plugins.diagnostic.isLocationAvailable(function (available) {
        $('#location-available').text(available ? 'Доступна' : 'Недоступна');
    });

    cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
        $('#location-enabled').html(enabled ? 'Включен' : 'Выключен');

        if (enabled) {
            cordova.plugins.diagnostic.isLocationAuthorized(function (authorized) {
                if (!authorized) {
                    $('#location-authorized').parent().show();
                    $('#location-authorized').html('Запрещён');
                } else {
                    $('#location-authorized').parent().hide();
                    $('#location-authorized').html('');
                }
            });
        } else {
            $('#location-authorized').html('Запрещён');
        }
    });

    if (cordova.platformId === "android") {
        cordova.plugins.diagnostic.getLocationMode(function (mode) {
            switch (mode) {
                case cordova.plugins.diagnostic.locationMode.HIGH_ACCURACY:
                    $('#location-mode').html('Высокая точность (GPS + сети)');
                    break;
                case cordova.plugins.diagnostic.locationMode.DEVICE_ONLY:
                    $('#location-mode').html('Высокая точность (только GPS)');
                    break;
                case cordova.plugins.diagnostic.locationMode.BATTERY_SAVING:
                    $('#location-mode').text('Средняя точность (только сети)');
                    break;
                case cordova.plugins.diagnostic.locationMode.LOCATION_OFF:
                    $('#location-mode').html('Определение выключено');
                    break;
            }
        });
    }
}

function handleLocationAuthorizationStatus(status) {
    switch (status) {
        case cordova.plugins.diagnostic.permissionStatus.GRANTED:
            if (cordova.platformId === "ios") {
                onSuccess();
            } else {
                _makeRequest();
            }
            break;
        case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
            // iOS only
            onSuccess();
            break;
        case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
            requestLocationAuthorization();
            break;
        case cordova.plugins.diagnostic.permissionStatus.DENIED:
            if (cordova.platformId === "android") {
                onError(needPermissionMessage);
            } else {
                _makeRequest();
            }
            break;
        case cordova.plugins.diagnostic.permissionStatus.DENIED_ONCE:
            if (cordova.platformId === "android") {
                onError(needPermissionMessage);
            } else {
                _makeRequest();
            }
            break;
        case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
            // Android only
            onError(needPermissionMessage);
            break;
    }
}

function requestLocationAuthorization() {
    cordova.plugins.diagnostic.requestLocationAuthorization(handleLocationAuthorizationStatus);
}

function requestLocationAccuracy() {
    cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
        if (enabled) {
            cordova.plugins.diagnostic.getLocationAuthorizationStatus(handleLocationAuthorizationStatus);
        } else {
            onError(needLocationMessage);
        }
    });
}

function _makeRequest() {
    cordova.plugins.locationAccuracy.canRequest(function (canRequest) {
        if (canRequest) {
            var networkState = navigator.connection.type;

            // условия тут

            cordova.plugins.locationAccuracy.request(function () {
                onSuccess();
            }, function (error) {
                if (error.code === cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
                    alert('юзер отклонил');
                }
            }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_BALANCED_POWER_ACCURACY // iOS will ignore this
            );
        } else {
            // On iOS, this will occur if Location Services is currently on OR a request is currently in progress.
            // On Android, this will occur if the app doesn't have authorization to use location.

            if (cordova.platformId === "android") {
                onError(needPermissionMessage);
            }
        }
    });
}
