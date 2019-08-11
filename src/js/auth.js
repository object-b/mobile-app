const Auth = {
    isAuthenticated() {
        return new Promise(function (resolve, reject) {
            var token = localStorage.getItem('AUTH_TOKEN');

            if (token) {
                resolve(token);
            } else {
                reject(token);
            }
        });
    },

    authenticateUser(data) {
        return Promise.resolve().then(function () {
            localStorage.setItem('AUTH_TOKEN', data.api_key);
            localStorage.setItem('USER_DATA', JSON.stringify(data));
        });
    },

    logoutUser() {
        return Promise.resolve().then(function () {
            localStorage.removeItem('AUTH_TOKEN');
            localStorage.removeItem('USER_DATA');
        });
    },

    getUserProfileInfo() {
        return JSON.parse(localStorage.getItem('USER_DATA'));
    },
};

export default Auth;
