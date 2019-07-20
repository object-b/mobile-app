import $$ from 'dom7';
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

var app = new Framework7({
  root: '#app', // App root element
  id: 'io.mobile.trash', // App bundle ID
  name: 'Object b', // App name
  theme: 'auto', // Automatic theme detection
  
  // App root data
  data: function () {
    return {
      authApiUrl: 'https://rvlasenko.simtechdev.us/fresh_backend/public/api',
      authSocialApiUrl: 'https://rvlasenko.simtechdev.us/fresh_backend/public/oauth/token',
      mainApiUrl: '',
    };
  },
  // App root methods
  methods: {
    openAuthToast: function(message) {
      app.toast.create({
        text: message,
        position: 'bottom',
        closeTimeout: 4500,
      }).open();
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

// Register
// $$('.register-button').on('click', function () {
//   var username = $$('#my-login-screen [name="username"]').val();
//   var password = $$('#my-login-screen [name="password"]').val();

//   // Close login screen
//   app.loginScreen.close('#my-login-screen');

//   // Alert username and password
//   app.dialog.alert('Username: ' + username + '<br>Password: ' + password);
// });