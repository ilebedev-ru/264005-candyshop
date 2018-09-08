'use strict';

var NAMES = [
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
];

var PICTURES = [
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
];

var AMOUNTS = {
  min: 0,
  max: 20
};

var PRICES = {
  min:  100,
  max: 1500
};

var WEIGHTS = {
  min: 30,
  max: 300
};

var RATING_VALUES = {
  min: 1,
  max: 5
};

var RATING_NUMBERS = {
  min: 10,
  max: 900
}

var NUTRITION_FACTS_ENERGYS = {
  min: 70,
  max: 500
};

var NUTRITION_FACTS_CONTENT = [
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
];

var ratings = [RATING_VALUES, RATING_NUMBERS];
var nutritionFacts = [NUTRITION_FACTS_ENERGYS, NUTRITION_FACTS_CONTENT];

var goods = [NAMES, PICTURES, AMOUNTS, PRICES, WEIGHTS, ratings, nutritionFacts];


var getRamdomArrIndex = function(arr) {
  return Math.floor(Math.random() * arr.length);
};

var getRandomNumber = function (min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1)
  rand = Math.round(rand);
  return rand;
};

var getRandomBoolean = function() {
  return !!Math.round(Math.random());
};

var getRandomString = function(arr) {
  var randomString = '';
  var stringQuantity = getRandomNumber(1, arr.length);
  for(var i = 0; i < stringQuantity; i++) {
    randomString += (arr[i] + ', ');
  }
  return randomString = randomString.substring(0, randomString.length - 2);
};

var createGoodsItem = function(arr) {
  var GoodsItem = {
    name: arr[0][getRamdomArrIndex(arr[0])],
    picture: arr[1][getRamdomArrIndex(arr[1])],
    amount: getRandomNumber(arr[2].min, arr[2].max),
    price: getRandomNumber(arr[3].min, arr[3].max),
    weight: getRandomNumber(arr[4].min, arr[4].max),
    Rating: {
      value: getRandomNumber(arr[5][0].min, arr[5][0].max),
      number: getRandomNumber(arr[5][1].min, arr[5][1].max)
    },
    NutritionFact: {
      sugar: getRandomBoolean(),
      energy: getRandomNumber(arr[6][0].min, arr[6][0].max),
      contents: getRandomString(arr[6][1])
    }
  };
  return GoodsItem;
};


var goodsItems = [];
for (var i = 0; i < NAMES.length; i++) {
  goodsItems[i] = createGoodsItem(goods);
};

var catalogCards = document.querySelector('.catalog__cards');

catalogCards.classList.remove('catalog__cards--load');
catalogCards.querySelector('.catalog__load').classList.add('visually-hidden');

var catalogCardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');


var renderGoodsElement = function (item) {
  var goodsElement = catalogCardTemplate.cloneNode(true);

  goodsElement.querySelector('.card__title').textContent = item.name;
  goodsElement.querySelector('.card__img').src = item.picture;
  goodsElement.querySelector('.card__price').innerHTML = item.price + ' <span class="card__currency">₽</span><span class="card__weight">' + item.weight + ' Г</span>';
  // console.log(goodsElement.querySelector('.card__price'));
  // goodsElement.querySelector('.card__weight').textContent = item.weight;
  // goodsElement.querySelector('.star__count').textContent = item.Rating.number;
  // goodsElement.querySelector('.card__composition-list').textContent = item.NutritionFact.contents;

  return goodsElement;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < goodsItems.length; i++) {
  fragment.appendChild(renderGoodsElement(goodsItems[i]));
}

catalogCards.appendChild(fragment);


// + функцию генерации случайных данных,
//функцию создания DOM-элемента на основе JS-объекта,
//функцию заполнения блока DOM-элементами на основе массива JS-объектов.
