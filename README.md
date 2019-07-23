# Mobile app

## Заметки

master branch - es2015  
react branch - react js

Для social auth используются аккаунты разработчика.

Для facebook плагина использовались client_id и client_secret разработчика, но они были зашиты при установке следующим образом `--variable APP_ID="**" --variable APP_NAME="**"`, поэтому для смены этих переменных плагин надо скорее всего переустановить 😒

Для vkontakte была зашита переменная `--variable VK_APP_ID=**` которая дублирована в app.js.

## Деплой

```
cd mobile-app
npm i
cp src/config.json.example src/config.json
nano src/config.json
```

Информация будет дополняться.

## NPM комманды
* `npm run build-cordova-android-dev && cd cordova && cordova run android` - билд .apk и запуск его на эмуляторе с помощью Android Studio AVD
* `npm start` - запустить локальный сервер на localhost с live reload
* `npm run build-cordova-prod` - build cordova's `www` folder from and build cordova app
* `npm run build-cordova-dev` - build cordova's `www` folder from and build cordova app using development mode (faster build without minification and optimization)
* `npm run build-cordova-ios-prod` - build cordova's `www` folder from and build cordova iOS app
* `npm run build-cordova-ios-dev` - build cordova's `www` folder from and build cordova iOS app using development mode (faster build without minification and optimization)
* `npm run build-cordova-android-prod` - build cordova's `www` folder from and build cordova Android app
* `npm run build-cordova-android-dev` - build cordova's `www` folder from and build cordova Android app using development mode (faster build without minification and optimization)

## WebPack

There is a webpack bundler setup. It compiles and bundles all "front-end" resources. You should work only with files located in `/src` folder. Webpack config located in `build/webpack.config.js`.

Webpack has specific way of handling static assets (CSS files, images, audios). You can learn more about correct way of doing things on [official webpack documentation](https://webpack.js.org/guides/asset-management/).
## Cordova

Cordova project located in `cordova` folder. You shouldn't modify content of `cordova/www` folder. Its content will be correctly generated when you call `npm run cordova-build-prod`.



## Assets

Assets (icons, splash screens) source images located in `assets-src` folder. To generate your own icons and splash screen images, you will need to replace all assets in this directory with your own images (pay attention to image size and format), and run the following command in the project directory:

```
framework7 generate-assets
```

Or launch UI where you will be able to change icons and splash screens:

```
framework7 generate-assets --ui
```
