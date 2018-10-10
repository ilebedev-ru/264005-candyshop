'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var lastTimeout;
  window.debounce = function (fun, color1, color2) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL, color1, color2);
  };
})();
