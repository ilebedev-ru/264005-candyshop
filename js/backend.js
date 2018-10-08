'use strict';

(function () {
  var LOAD_URL = 'https://js.dump.academy/candyshop/data';
  var SAVE_URL = 'https://js.dump.academy/candyshop';

  var load = function (loadSuccessHandler, loadErrorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        loadSuccessHandler(xhr.response);
      } else {
        loadErrorHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }

    });

    xhr.addEventListener('error', function () {
      loadErrorHandler('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      loadErrorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000;

    xhr.open('GET', LOAD_URL);
    xhr.send();
  };

  var save = function (saveData, saveSuccessHandler, saveErrorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        saveSuccessHandler(xhr.response);
      } else {
        saveErrorHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }

    });

    xhr.addEventListener('error', function () {
      saveErrorHandler('Произошла ошибка отправки формы');
    });

    xhr.open('POST', SAVE_URL);
    xhr.send(saveData);
  };

  window.backend = {
    load: load,
    save: save
  };
})();
