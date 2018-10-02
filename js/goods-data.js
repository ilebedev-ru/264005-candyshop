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

  var ratingStars = {
    1: 'stars__rating--one',
    2: 'stars__rating--two',
    3: 'stars__rating--three',
    4: 'stars__rating--four',
    5: 'stars__rating--five'
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

  var createGoodsItem = function (goodsData, i) {
    var goodsItem = {
      name: shuffleArray(goodsData.NAMES)[i],
      picture: goodsData.PICTURES[getRandomNumber(0, goodsData.PICTURES.length - 1)],
      amount: getRandomNumber(goodsData.AMOUNTS.min, goodsData.AMOUNTS.max),
      price: getRandomNumber(goodsData.PRICES.min, goodsData.PRICES.max),
      weight: getRandomNumber(goodsData.WEIGHTS.min, goodsData.WEIGHTS.max),
      Rating: {
        value: getRandomNumber(goodsData.RATING_VALUES.min, goodsData.RATING_VALUES.max),
        number: getRandomNumber(goodsData.RATING_NUMBERS.min, goodsData.RATING_NUMBERS.max)
      },
      NutritionFact: {
        sugar: getRandomBoolean(),
        energy: getRandomNumber(goodsData.NUTRITION_FACTS_ENERGYS.min, goodsData.NUTRITION_FACTS_ENERGYS.max),
        contents: getRandomContent(goodsData.NUTRITION_FACTS_CONTENT)
      }
    };

    return goodsItem;
  };

  var createGoodsCollection = function (goodsData, num) {
    var collection = [];

    for (var i = 0; i < num; i++) {
      collection[i] = createGoodsItem(goodsData, i);
    }
    return collection;
  };

  var goodsCollection = createGoodsCollection(GoodsData, GoodsData.NUMBER);

  window.goodsData = {
    GoodsData: GoodsData,
    ratingStars: ratingStars,
    goodsCollection: goodsCollection,
  };
})();
