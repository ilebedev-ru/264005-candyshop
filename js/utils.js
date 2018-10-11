'use strict';

(function () {
  var ESC_KEYCODE = 27;

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

  var getArrIndex = function (arr, property) {
    var arrIndex = '';
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].name === property) {
        arrIndex = i;
      }
    }
    return arrIndex;
  };

  var findMaxValue = function (array) {
    var max = array[0];
    for (var i = 1; i < array.length; i++) {
      if (array[i] > max) {
        max = array[i];
      }
    }
    return max;
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

  var unique = function (arr) {
    var result = [];
    for (var i = 0, l = arr.length; i < l; i++) {
      if (result.indexOf(arr[i]) === -1 && arr[i] !== '') {
        result.push(arr[i]);
      }
    }
    return result;
  };

  window.utils = {
    ESC_KEYCODE: ESC_KEYCODE,
    starsToClassName: starsToClassName,
    paymentValidateParam: paymentValidateParam,
    findMaxValue: findMaxValue,
    getDataItem: getDataItem,
    getArrIndex: getArrIndex,
    checkNumberByLun: checkNumberByLun,
    unique: unique
  };
})();
