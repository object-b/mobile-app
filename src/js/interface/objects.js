import Dexie from 'dexie';
import * as config from './../../config';
import Framework7 from 'framework7/framework7.esm.bundle.js';

var db = new Dexie("TrashDB");
var pageSize = 10;
var pageNumberServer = 1;
var pageNumberDexie = 0;
var objectsGetUrl = config.apiObjectsUrl;

db.version(1).stores({
    objects: ",status,author,date,firstImage,type,size",
});

// Достать страницу из хранилища или API
export function getObjects(success, failure) {
    config.debug && console.log('get obj')

    if (1) {
        updateObjectsFromServer(function (response) {
            success(response.data);
        }, failure);
    } else {
        readFromStorage(function (objects) {
            success(objects);
        }, failure);
    }

    pageNumberServer++;
    pageNumberDexie++;

    config.debug && console.log('page', pageNumberServer);
}

// Обновить или добавить объекты
export function putObjects(newObjects) {
    config.debug && console.log('put init')
    
    return db.transaction('rw', db.objects, function () {
        config.debug && console.log('putting :)')
        newObjects.forEach(function (item) {
            db.objects.put(item, item.id);
        });
    }).then(function () {
        config.debug && console.log('put done')
        config.debug && console.log("Транзакция завершена put");
    }).catch(function(err) {
        console.error(err.stack || err);
    });
}

// Взять из сервера и положить в хранилище
export function updateObjectsFromServer(success, failure) {
    var yep = function(response) {
        config.debug && console.log('update yep')
        putObjects(response.data).then(function() {
            success(response);
        });
    };

    var nope = function(status) {
        failure(status);
    };
    
    Framework7.request.promise.json(objectsGetUrl, {
        page: pageNumberServer
    })
    .then(yep)
    .catch(nope);
}

export function readFromStorage(success, failure) {
    config.debug && console.log('read from store here')
    
    db.objects
    .offset(pageNumberDexie * pageSize)
    .limit(pageSize)
    .reverse()
    .toArray()
    .then(success)
    .catch(failure);
}
