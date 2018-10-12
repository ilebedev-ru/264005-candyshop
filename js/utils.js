'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var DEBOUNCE_INTERVAL = 500;

  var lastTimeout;

  var starsToClassName = {
    1: 'stars__rating--one',
    2: 'stars__rating--two',
    3: 'stars__rating--three',
    4: 'stars__rating--four',
    5: 'stars__rating--five'
  };

  var paymentValidateParam = {
    CVC_MIN: 100,
    CARD_LENGTH: 16,
    DATE_LENGTH: 5
  };

  var getDataItem = function (evt, clickArea, className, title) {
    var target = evt.target;

    while (target !== clickArea) {
      if (target.classList.contains(className)) {
        return target.querySelector(title).textContent;
      }
      target = target.parentElement;
    }
    return target;
  };

  var checkNumberByLun = function (number) {
    var numArr = number.split('').reverse();
    var results = 0;

    for (var i = 0; i < numArr.length; i++) {
      if (i % 2 !== 0) {
        var evenNum = +numArr[i] * 2;
        results += (evenNum > 9) ? evenNum -= 9 : evenNum;
      } else {
        results += +numArr[i];
      }
    }
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
    getDataItem: getDataItem,
    checkNumberByLun: checkNumberByLun,
    getUnique: getUnique,
    debounce: debounce
  };
})();
