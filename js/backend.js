'use strict';

(function () {
  var LOAD_URL = 'https://js.dump.academy/candyshop/data';
  var SAVE_URL = 'https://js.dump.academy/candyshop';

  var createXhr = function (timeout, succHandler, errHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = timeout;

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        succHandler(xhr.response);
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
    var loadXhr = createXhr(10000, loadSuccessHandler, loadErrorHandler);
    loadXhr.open('GET', LOAD_URL);
    loadXhr.send();
  };

  var save = function (saveData, saveSuccessHandler, saveErrorHandler) {
    var saveXhr = createXhr(10000, saveSuccessHandler, saveErrorHandler);
    saveXhr.open('POST', SAVE_URL);
    saveXhr.send(saveData);
  };

  window.backend = {
    load: load,
    save: save
  };
})();
