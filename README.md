# Mobile app

## Android

## iOS
### Описание пермишенов

Заполняются с инфой следующие из них:

- **NSLocationWhenInUseUsageDescription**
- **NSCameraUsageDescription**
- **NSPhotoLibraryUsageDescription**

# Social auth
При установке facebook плагина были добавлены девелопмент значения **APP_ID** и **APP_NAME**, а для vkontakte **VK_APP_ID**. Надо придумать смену этих переменных для релиза.

## Facebook

Сгенерировать хэш адрес
```
keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
```

## Vkontakte

Сгенерировать SHA1 "Отпечаток сертификата для Android" в котором потом удалить двоеточия
```
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey
```

# Деплой

```
cd mobile-app
npm i
cp src/config.json.example src/config.json
nano src/config.json
```

## NPM команды
* `npm run build-cordova-android-dev && cd cordova && cordova run android` - билд, установка и запуск в эмуляторе Android Studio AVD
* `npm run build-cordova-ios-dev && cd cordova && cordova run ios` - билд, установка и запуск в эмуляторе XCode Simulator
* `npm start` - запуск локального сервера на localhost:8080
---
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
