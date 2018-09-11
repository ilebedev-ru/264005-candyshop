'use strict';


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

  NUMBER_OF_GOODS: 26,
  NUMBER_OF_GOODS_IN_CARD: 3
};

var getRamdomArrElement = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var getRandomNumber = function (min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
};

var getRandomBoolean = function () {
  return !!Math.round(Math.random());
};

var getRandomString = function (arr) {
  var randomString = '';
  var stringQuantity = getRandomNumber(1, arr.length);
  for (var i = 0; i < stringQuantity; i++) {
    randomString += (arr[i] + ', ');
  }
  randomString.substring(0, randomString.length - 2);
  return randomString;
};

var shuffleArray = function (arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
};

var createGoodsItem = function (goodsData, i) {
  var goodsItem = {
    name: goodsData.NAMES[i],
    picture: getRamdomArrElement(goodsData.PICTURES),
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
      contents: getRandomString(goodsData.NUTRITION_FACTS_CONTENT)
    }
  };
  return goodsItem;
};

var createGoodsCollection = function (goodsData, num) {
  var collection = [];
  shuffleArray(goodsData.NAMES);

  for (var i = 0; i < num; i++) {
    collection[i] = createGoodsItem(goodsData, i);
  }
  return collection;
};

var renderGoodsElement = function (item) {
  var catalogCardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
  var goodsElement = catalogCardTemplate.cloneNode(true);

  goodsElement.querySelector('.card__title').textContent = item.name;
  goodsElement.querySelector('.card__img').src = item.picture;
  goodsElement.querySelector('.card__img').alt = item.name;
  goodsElement.querySelector('.card__price').innerHTML = item.price
    + ' <span class="card__currency">₽</span><span class="card__weight">'
    + item.weight
    + ' Г</span>';

  goodsElement.classList.remove('card--in-stock');
  if (item.amount > 5) {
    goodsElement.classList.add('card--in-stock');
  } else if (item.amount <= 5 && item.amount >= 1) {
    goodsElement.classList.add('card--little');
  } else if (item.amount === 0) {
    goodsElement.classList.add('card--soon');
  }

  goodsElement.querySelector('.stars__rating').classList.remove('stars__rating--five');
  if (item.Rating.value === 1) {
    goodsElement.querySelector('.stars__rating').classList.add('stars__rating--one');
  } else if (item.Rating.value === 2) {
    goodsElement.querySelector('.stars__rating').classList.add('stars__rating--two');
  } else if (item.Rating.value === 3) {
    goodsElement.querySelector('.stars__rating').classList.add('stars__rating--three');
  } else if (item.Rating.value === 4) {
    goodsElement.querySelector('.stars__rating').classList.add('stars__rating--four');
  } else if (item.Rating.value === 5) {
    goodsElement.querySelector('.stars__rating').classList.add('stars__rating--five');
  }

  goodsElement.querySelector('.star__count').textContent = item.Rating.number;

  if (item.NutritionFact.sugar) {
    goodsElement.querySelector('.card__characteristic').textContent = 'Содержит сахар';
  } else {
    goodsElement.querySelector('.card__characteristic').textContent = 'Без сахара';
  }

  goodsElement.querySelector('.card__composition-list').textContent = item.NutritionFact.contents;

  return goodsElement;
};

var createGoodsFragment = function (items) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < items.length; i++) {
    fragment.appendChild(renderGoodsElement(items[i]));
  }
  return fragment;
};

var showGoods = function () {
  var catalogCards = document.querySelector('.catalog__cards');
  catalogCards.classList.remove('catalog__cards--load');
  catalogCards.querySelector('.catalog__load').classList.add('visually-hidden');

  var goodsItems = createGoodsCollection(GoodsData, GoodsData.NUMBER_OF_GOODS);
  catalogCards.appendChild(createGoodsFragment(goodsItems));
};

showGoods();

// CARD
var renderGoodsInCardElement = function (item) {
  var goodsCardTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
  var goodsInCardElement = goodsCardTemplate.cloneNode(true);

  goodsInCardElement.querySelector('.card-order__title').textContent = item.name;
  goodsInCardElement.querySelector('.card-order__img').src = item.picture;
  goodsInCardElement.querySelector('.card-order__img').alt = item.name;
  goodsInCardElement.querySelector('.card-order__price').textContent = item.price + ' ₽';

  return goodsInCardElement;
};

var createGoodsInCardFragment = function (items) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < items.length; i++) {
    fragment.appendChild(renderGoodsInCardElement(items[i]));
  }
  return fragment;
};

var showGoodsInCard = function () {
  var goodsCards = document.querySelector('.goods__cards');
  goodsCards.classList.remove('goods__cards--empty');
  goodsCards.querySelector('.goods__card-empty').classList.add('visually-hidden');

  var goodsItemsInCard = createGoodsCollection(GoodsData, GoodsData.NUMBER_OF_GOODS_IN_CARD);
  goodsCards.appendChild(createGoodsInCardFragment(goodsItemsInCard));
};

showGoodsInCard();
