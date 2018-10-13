'use strict';

(function () {
  var LOAD_URL = 'https://js.dump.academy/candyshop/data';
  var SAVE_URL = 'https://js.dump.academy/candyshop';
  var SERVER_OK_STATUS = 200;
  var SERVER_TIMEOUT = 10000;

  var createXhr = function (timeout, successHandler, errHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = timeout;

    xhr.addEventListener('load', function () {
      if (xhr.status === SERVER_OK_STATUS) {
        successHandler(xhr.response);
      } else {
        errHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      errHandler('Произошла ошибка');
    });

    xhr.addEventListener('timeout', function () {
      errHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    return xhr;
  };

  var load = function (loadSuccessHandler, loadErrorHandler) {
    var loadXhr = createXhr(SERVER_TIMEOUT, loadSuccessHandler, loadErrorHandler);
    loadXhr.open('GET', LOAD_URL);
    loadXhr.send();
  };

  var save = function (saveData, saveSuccessHandler, saveErrorHandler) {
    var saveXhr = createXhr(SERVER_TIMEOUT, saveSuccessHandler, saveErrorHandler);
    saveXhr.open('POST', SAVE_URL);
    saveXhr.send(saveData);
  };

  window.backend = {
    load: load,
    save: save
  };
})();
