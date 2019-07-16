import React from 'react';
import {
  App as AppRoot,
  Statusbar,
  View,
  Views,
  Toolbar,
  Link
} from 'framework7-react';

import cordovaApp from '../js/cordova-app';
import routes from '../js/routes';
import * as config from '../config';

export default class extends React.Component {
  constructor() {
    super();

    this.state = {
      // Framework7 Parameters
      f7params: {
        id: config.appId, // App bundle ID
        name: config.name, // App name
        theme: 'auto', // Automatic theme detection

        // Fake data
        data: function () {
          return {
            products: [
              {
                id: '1',
                title: 'Apple iPhone 88',
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.'
              },
              {
                id: '2',
                title: 'Apple iPhone 8 Plus',
                description: 'Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! Nostrum porro sunt sint eveniet maiores, dolorem itaque!'
              },
              {
                id: '3',
                title: 'Apple iPhone X',
                description: 'Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. Labore dolores amet quos, accusamus earum asperiores officiis assumenda optio architecto quia neque, quae eum.'
              },
            ]
          };
        },

        // Events
        // on: {
        //   routerAjaxStart: function (xhr) {
        //     this.preloader.show();
        //   },
        //   routerAjaxSuccess: function (xhr) {
        //     this.preloader.hide();
        //   },
        // },

        // Cordova Statusbar settings
        statusbar: {
          overlay: this.$device.cordova && this.$device.ios || 'auto',
          iosOverlaysWebView: true,
          androidOverlaysWebView: false,
        },
      },
    }
  }
  render() {
    return (
      <AppRoot params={this.state.f7params} routes={routes}>
        {/* Status bar overlay for fullscreen mode*/}
        <Statusbar />

        {/* Views/Tabs container */}
        <Views tabs className="safe-areas">
          {/* Tabbar for switching views-tabs */}
          <Toolbar tabbar labels bottom>
            <Link tabLink="#view-object-list" tabLinkActive iconIos="f7:list" iconMd="material:list" text="Список объектов" />
            <Link tabLink="#view-object-map" iconIos="f7:world" iconMd="material:language" text="Карта объектов" />
          </Toolbar>

          {/* Наш главный вью. При переходе на него мы сперва редиректим на страницу логина */}
          <View id="view-object-list" main tab tabActive url="/object-list" />
 
          <View id="view-object-map" tab url="/object-map" />
        </Views>
      </AppRoot>
    )
  }
  componentDidMount() {
    this.$f7ready((f7) => {
      // Init cordova APIs (see cordova-app.js)
      if (f7.device.cordova) {
        cordovaApp.init(f7);
      }
      // Call F7 APIs here
      // Полезный метод для генерации css переменных для цветовой схемы
      // console.log(f7.utils.colorThemeCSSProperties('#8dc947'))
    });
  }
}