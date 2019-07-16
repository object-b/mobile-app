// Import React and ReactDOM
import React from 'react';
import ReactDOM from 'react-dom';

// Import Framework7
import Framework7 from 'framework7/framework7.esm.bundle.js';

// Import Framework7-React Plugin
import Framework7React from 'framework7-react';

// Import Framework7 Styles
import 'framework7/css/framework7.bundle.css';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/fontawesome.min.css';
import '../css/demo.css';
import '../css/app.css';

// Import App Component
import App from '../components/app.jsx';

import * as serviceWorker from '../serviceWorker.js';

// Init F7 Vue Plugin
Framework7.use(Framework7React)

// Mount React App
ReactDOM.render(
  React.createElement(App),
  document.getElementById('app'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();