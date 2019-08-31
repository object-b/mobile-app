var successCall;
var failureCall;

export function init(success, failure) {
    failureCall = failure;
    successCall = success;

    if (cordova.platformId === "android") {
        requestLocationAuthorization();
    } else {
        _makeRequest();
    }
}

function onError(error) {
    console.error("The following error occurred: " + error);
    failureCall(error);
}

function onSuccess(success) {
    successCall();
}

function handleLocationAuthorizationStatus(status) {
    switch (status) {
        case cordova.plugins.diagnostic.permissionStatus.GRANTED:
            if (cordova.platformId === "ios") {
                onSuccess("Location services is already switched ON");
            } else {
                _makeRequest();
            }
            break;
        case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
            requestLocationAuthorization();
            break;
        case cordova.plugins.diagnostic.permissionStatus.DENIED:
            if (cordova.platformId === "android") {
                onError("User denied permission to use location");
            } else {
                _makeRequest();
            }
            break;
        case cordova.plugins.diagnostic.permissionStatus.DENIED_ONCE:
            if (cordova.platformId === "android") {
                onError("User denied permission to use location once");
            } else {
                _makeRequest();
            }
            break;
        case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
            // Android only
            onError("User denied permission to use location always");
            break;
        case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
            // iOS only
            onSuccess("Location services is already switched ON");
            break;
    }
}

function requestLocationAuthorization() {
    cordova.plugins.diagnostic.requestLocationAuthorization(handleLocationAuthorizationStatus, onError);
}

function requestLocationAccuracy() {
    cordova.plugins.diagnostic.getLocationAuthorizationStatus(handleLocationAuthorizationStatus, onError);
}

function _makeRequest() {
    cordova.plugins.locationAccuracy.canRequest(function (canRequest) {
        if (canRequest) {
            cordova.plugins.locationAccuracy.request(function () {
                onSuccess("Location accuracy request successful");
            }, function (error) {
                onError("Error requesting location accuracy: " + JSON.stringify(error));
                if (error) {
                    // Android only
                    onError("error code=" + error.code + "; error message=" + error.message);
                    if (cordova.platformId === "android" && error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
                        if (window.confirm("Серьезная ошибка. Перейти в настройки локации?")) {
                            cordova.plugins.diagnostic.switchToLocationSettings();
                        }
                    }
                }
            }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
        } else {
            // On iOS, this will occur if Location Services is currently on OR a request is currently in progress.
            // On Android, this will occur if the app doesn't have authorization to use location.
            if (cordova.platformId === "android") {
                onError("Cannot request location accuracy");
            } else {
                onSuccess("Location accuracy request successful");
            }
        }
    });
}