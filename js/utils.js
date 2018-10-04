'use strict';

(function () {
  var GoodsData = {
    NAMES: [
      'Чесночные сливки',
      'Огуречный педант',
      'Молочная хрюша',
      'Грибной шейк',
      'Баклажановое безумие',
      'Паприколу итальяно',
      'Нинзя-удар васаби',
      'Хитрый баклажан',
      'Горчичный вызов',
      'Кедровая липучка',
      'Корманный портвейн',
      'Чилийский задира',
      'Беконовый взрыв',
      'Арахис vs виноград',
      'Сельдерейная душа',
      'Початок в бутылке',
      'Чернющий мистер чеснок',
      'Раша федераша',
      'Кислая мина',
      'Кукурузное утро',
      'Икорный фуршет',
      'Новогоднее настроение',
      'С пивком потянет',
      'Мисс креветка',
      'Бесконечный взрыв',
      'Невинные винные',
      'Бельгийское пенное',
      'Острый язычок'
    ],

    PICTURES: [
      'img/cards/ice-garlic.jpg',
      'img/cards/ice-cucumber.jpg',
      'img/cards/ice-pig.jpg',
      'img/cards/ice-mushroom.jpg',
      'img/cards/ice-eggplant.jpg',
      'img/cards/ice-italian.jpg',
      'img/cards/gum-wasabi.jpg',
      'img/cards/gum-eggplant.jpg',
      'img/cards/gum-mustard.jpg',
      'img/cards/gum-cedar.jpg',
      'img/cards/gum-portwine.jpg',
      'img/cards/gum-chile.jpg',
      'img/cards/soda-bacon.jpg',
      'img/cards/soda-peanut-grapes.jpg',
      'img/cards/soda-celery.jpg',
      'img/cards/soda-cob.jpg',
      'img/cards/soda-garlic.jpg',
      'img/cards/soda-russian.jpg',
      'img/cards/marmalade-sour.jpg',
      'img/cards/marmalade-corn.jpg',
      'img/cards/marmalade-caviar.jpg',
      'img/cards/marmalade-new-year.jpg',
      'img/cards/marmalade-beer.jpg',
      'img/cards/marshmallow-shrimp.jpg',
      'img/cards/marshmallow-bacon.jpg',
      'img/cards/marshmallow-wine.jpg',
      'img/cards/marshmallow-beer.jpg',
      'img/cards/marshmallow-spicy.jpg'
    ],

    AMOUNTS: {
      min: 0,
      max: 20
    },

    PRICES: {
      min: 100,
      max: 1500
    },

    WEIGHTS: {
      min: 30,
      max: 300
    },

    RATING_VALUES: {
      min: 1,
      max: 5
    },

    RATING_NUMBERS: {
      min: 10,
      max: 900
    },

    NUTRITION_FACTS_ENERGYS: {
      min: 70,
      max: 500
    },

    NUTRITION_FACTS_CONTENT: [
      'молоко',
      'сливки',
      'вода',
      'пищевой краситель',
      'патока',
      'ароматизатор бекона',
      'ароматизатор свинца',
      'ароматизатор дуба, идентичный натуральному',
      'ароматизатор картофеля',
      'лимонная кислота',
      'загуститель',
      'эмульгатор',
      'консервант: сорбат калия',
      'посолочная смесь: соль, нитрит натрия',
      'ксилит',
      'карбамид',
      'вилларибо',
      'виллабаджо',
    ],

    NUMBER: 26
  };

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

  var getRandomNumber = function (min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
  };

  var getRandomBoolean = function () {
    return Math.random() >= 0.5;
  };

  var shuffleArray = function (arr) {
    var shuffledArr = arr.slice(0);
    for (var i = shuffledArr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = shuffledArr[i];
      shuffledArr[i] = shuffledArr[j];
      shuffledArr[j] = temp;
    }
    return shuffledArr;
  };

  var getRandomContent = function (arr) {
    var baseIngrigients = arr.slice(0, 2);
    var randomQuality = getRandomNumber(2, arr.length - 1);
    var shuffleArr = shuffleArray(arr.slice(randomQuality, arr.length));
    var randomContent = baseIngrigients.join(', ') + ', ' + shuffleArr.join(', ');
    return randomContent;
  };

  var getDataItem = function (evt, clickArea, className) {
    var target = evt.target;

    while (target !== clickArea) {
      if (target.classList.contains(className)) {
        return target.dataset.item;
      }
      target = target.parentElement;
    }
    return target;
  };

  var getArrIndex = function (arr, property) {
    var arrIndex = '';
    for (var i = 0; i < arr.length; i++) {
      if (+arr[i].dataItem === +property) {
        arrIndex = i;
      }
    }
    return arrIndex;
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
    return (results % 10 === 0) ? true : false;
  };

  window.utils = {
    GoodsData: GoodsData,
    starsToClassName: starsToClassName,
    paymentValidateParam: paymentValidateParam,
    getRandomNumber: getRandomNumber,
    getRandomBoolean: getRandomBoolean,
    shuffleArray: shuffleArray,
    getRandomContent: getRandomContent,
    getDataItem: getDataItem,
    getArrIndex: getArrIndex,
    checkNumberByLun: checkNumberByLun
  };
})();
