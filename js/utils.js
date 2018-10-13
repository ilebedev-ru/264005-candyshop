'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var DEBOUNCE_INTERVAL = 500;

  var paymentValidateParam = {
    CVC_MIN: 100,
    CARD_LENGTH: 16,
    DATE_LENGTH: 5
  };

  var starsToClassName = {
    1: 'stars__rating--one',
    2: 'stars__rating--two',
    3: 'stars__rating--three',
    4: 'stars__rating--four',
    5: 'stars__rating--five'
  };

  var lastTimeout;

  var checkNumberByLun = function (number) {
    var arrNums = number.split('').reverse();
    var results = 0;

    arrNums.forEach(function (numItem, i) {
      if (i % 2 !== 0) {
        var evenNum = +numItem * 2;
        results += (evenNum > 9) ? evenNum -= 9 : evenNum;
      } else {
        results += +numItem;
      }
    });

    return results % 10 === 0;
  };

  var getUnique = function (arr) {
    return arr.filter(function (item, index, array) {
      return array.indexOf(item) === index;
    });
  };

  var debounce = function (fun, param) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL, param);
  };

  window.utils = {
    ESC_KEYCODE: ESC_KEYCODE,
    starsToClassName: starsToClassName,
    paymentValidateParam: paymentValidateParam,
    checkNumberByLun: checkNumberByLun,
    getUnique: getUnique,
    debounce: debounce
  };
})();
