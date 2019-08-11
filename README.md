# Mobile app

## Android 5.0+

## iOS

### Описание пермишенов

Для того чтобы пройти верификацию в AppStore необходимо корректно обозначить зачем приложению необходимо использование локации, камеры и галереи:

- **NSLocationWhenInUseUsageDescription**
- **NSCameraUsageDescription**
- **NSPhotoLibraryUsageDescription**

# Social auth
При установке facebook плагина были добавлены девелопмент значения **APP_ID** и **APP_NAME**, а для vkontakte **VK_APP_ID**.

## Facebook

Сгенерировать хэш адрес:
```
keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
```

## Vkontakte

Сгенерировать SHA1 "Отпечаток сертификата для Android" в котором потом удалить двоеточия
```
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey
```

# Локальный деплой

```
cd mobile-app
npm i
cp src/config.json.example src/config.json
nano src/config.json
cd cordova
cordova platform add android
cordova platform add ios
Установить Android Studio + XCode
brew install gradle
```

## Разработка в эмуляторе

Не всегда удобно вести разработку в браузере, так как плагины для Cordova не будут там работать. Для этого можно сделать нечто похожее на live-reload. В фоне будет запущен эмулятор платформы и туда будет инсталлиться приложение через консоль. Все команды ниже запускаются из директории проекта.

### Android

Есть несколько способов. Первый довольно прост:

`npm run build-cordova-android-dev-live`

В запущенный эмулятор должен установиться и запуститься .apk. И эту команду можно запускать позже. Но если кордове по каким-то причинам не удается увидеть или запустить эмулятор?

Второй способ:

`npm run build-cordova-android-dev`

После успешного билда в выводе появится путь к apk. Для проекта он всегда один и тот же. Строчка примерно такая:

>Built the following apk(s): /Users/root/cordova/platforms/android/app/build/outputs/apk/debug/app-debug.apk

Теперь можно заменить путь в следующей команде которая сделает билд и установит его в запущенный эмулятор:

`npm run build-cordova-android-dev && adb install -r <path>`

Флаг -r отвечает за перестановку приложения. Если нужно установить с нуля, то:

`adb install -e <path>`

Теперь можно всегда использовать получившуюся команду. Также можно выполнять установку в подключенный USB девайс.

### iOS

Первый способ:

`npm run build-cordova-ios-dev && cd cordova && cordova run ios`

В эмулятор по дефолту (обычно это iPhone X) должно установиться и запуститься приложение. Неважно запущен он или нет.

Второй способ:

В случае же если нужно установить приложение в конкретный запущенный девайс, нужно сперва показать их список.

`./cordova/node_modules/ios-sim/bin/ios-sim showdevicetypes`

Затем скопировать нужный, например _iPhone-8, 12.2_ и запустить еще одну команду, заменив название приложения #app# и название девайса #device#:

`npm run build-cordova-ios-dev && ./cordova/node_modules/ios-sim/bin/ios-sim launch ./cordova/platforms/ios/build/emulator/#app# --devicetypeid com.apple.CoreSimulator.SimDeviceType.#device# --exit`

Теперь можно всегда использовать получившуюся команду.

## Другие NPM команды

Первые две содержат в себе алиас `cordova`, который должен быть настроен глобально.

* `npm run build-cordova-android-dev && cd cordova && cordova run android` - билд, установка и запуск в эмуляторе Android Studio AVD
* `npm run build-cordova-ios-dev && cd cordova && cordova run ios` - билд, установка и запуск в эмуляторе XCode Simulator
* `npm start` - запуск локального веб-сервера на localhost:8080
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
