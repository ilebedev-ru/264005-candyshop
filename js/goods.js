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

  NUMBER: 26
};

var ratingStars = {
  1: 'stars__rating--one',
  2: 'stars__rating--two',
  3: 'stars__rating--three',
  4: 'stars__rating--four',
  5: 'stars__rating--five'
};

var catalogCards = document.querySelector('.catalog__cards');
var catalogCardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');

var buyForm = document.querySelector('.buy form');
var buyFormInputs = buyForm.querySelectorAll('input');

var payment = document.querySelector('.payment');
var paymentCard = payment.querySelector('.payment__card-wrap');
var paymentCash = payment.querySelector('.payment__cash-wrap');
var paymentCardInputs = paymentCard.querySelectorAll('input');

var deliver = document.querySelector('.deliver');
var deliverStore = deliver.querySelector('.deliver__store');
var deliverCourier = deliver.querySelector('.deliver__courier');
var deliverСourierInputs = deliver.querySelectorAll('.deliver__address-entry-fields input');
var deliverStoreInputs = deliver.querySelectorAll('.deliver__store-list input');
var deliverStoreImg = deliver.querySelector('.deliver__store-map-img');


var getCardDataItem = function (evt) {
  var target = evt.target;

  while (target !== catalogCards) {
    if (target.classList.contains('catalog__card')) {
      return target.dataset.item;
    }
    target = target.parentElement;
  }
  return target;
};

catalogCards.addEventListener('click', function (evt) {
  var dataItem = getCardDataItem(evt);
  var activeCard = goodsCollection[dataItem];

  // добавление в корзину
  if (evt.target.classList.contains('card__btn')) {
    evt.preventDefault();

    if (activeCard.amount > 0) {
      copyGoodsToCard(activeCard, dataItem);
    }
  }

  // показать состав
  if (evt.target.classList.contains('card__btn-composition')) {
    var allCardsElement = catalogCards.querySelectorAll('[data-item]');
    for (var i = 0; i < allCardsElement.length; i++) {
      if (allCardsElement[i].dataset.item === dataItem) {
        allCardsElement[i].querySelector('.card__composition').classList.toggle('card__composition--hidden');
      }
    }
  }

  // добавление в избранное
  if (evt.target.classList.contains('card__btn-favorite')) {
    evt.preventDefault();
    evt.target.classList.toggle('card__btn-favorite--selected');
  }
});

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

var disabledBuyForm = function (boolean) {
  for (var i = 0; i < buyFormInputs.length; i++) {
    buyFormInputs[i].disabled = boolean;
  }
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

var putClassOnElementAmount = function (element, item) {
  element.classList.remove('card--in-stock');

  if (item > 5) {
    element.classList.add('card--in-stock');
  } else if (item <= 5 && item >= 1) {
    element.classList.add('card--little');
  } else if (item === 0) {
    element.classList.add('card--soon');
  }
};

var createGoodsElement = function (item, i) {
  var goodsElement = catalogCardTemplate.cloneNode(true);

  goodsElement.querySelector('.card__title').textContent = item.name;
  goodsElement.querySelector('.card__img').src = item.picture;
  goodsElement.querySelector('.card__img').alt = item.name;
  goodsElement.querySelector('.card__price').innerHTML = item.price
    + ' <span class="card__currency">₽</span><span class="card__weight">'
    + item.weight
    + ' Г</span>';

  putClassOnElementAmount(goodsElement, item.amount);

  goodsElement.querySelector('.stars__rating').classList.remove('stars__rating--five');
  goodsElement.querySelector('.stars__rating').classList.add(ratingStars[item.Rating.value]);
  goodsElement.querySelector('.star__count').textContent = item.Rating.number;
  goodsElement.querySelector('.card__characteristic').textContent = item.NutritionFact.sugar ? 'Содержит сахар' : 'Без сахара';
  goodsElement.querySelector('.card__composition-list').textContent = item.NutritionFact.contents;
  goodsElement.dataset.item = i;

  return goodsElement;
};

var createGoodsFragment = function (items) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < items.length; i++) {
    fragment.appendChild(createGoodsElement(items[i], i));
  }
  return fragment;
};

var showGoods = function () {
  catalogCards.appendChild(createGoodsFragment(goodsCollection));

  catalogCards.classList.remove('catalog__cards--load');
  catalogCards.querySelector('.catalog__load').classList.add('visually-hidden');
};

showGoods();

// CARD

var goodsInCardCollection = [];
var goodsCardTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
var goodsCards = document.querySelector('.goods__cards');
var basketCount = document.querySelector('.main-header__basket');
disabledBuyForm(true);


goodsCards.addEventListener('click', function (evt) {
  var dataItemInCard = getDataItemInCard(evt);
  var cardCollectionIndex = getArrIndex(goodsInCardCollection, dataItemInCard);
  var activeItemInCard = goodsInCardCollection[cardCollectionIndex];
  var allGoodsInCardElement = goodsCards.querySelectorAll('[data-item]');

  // удаление товара
  if (evt.target.classList.contains('card-order__close')) {
    evt.preventDefault();
    deleteGoodsInCard(cardCollectionIndex, allGoodsInCardElement);
  }

  // уменьшение количества
  if (evt.target.classList.contains('card-order__btn--decrease')) {
    if (activeItemInCard.orderedAmount > 0) {
      activeItemInCard.orderedAmount -= 1;
      showOrderedAmountSumm();
      showOrderedAmount(activeItemInCard);

      if (activeItemInCard.orderedAmount === 0) {
        deleteGoodsInCard(cardCollectionIndex, allGoodsInCardElement);
      }
    }
  }

  // увеличение количества
  if (evt.target.classList.contains('card-order__btn--increase')) {
    if (activeItemInCard.orderedAmount < activeItemInCard.amount) {
      activeItemInCard.orderedAmount++;
      showOrderedAmountSumm();
      showOrderedAmount(activeItemInCard);
    }
  }
});

var getDataItemInCard = function (evt) {
  var target = evt.target;

  while (target !== goodsCards) {
    if (target.classList.contains('goods_card')) {
      return target.dataset.item;
    }
    target = target.parentElement;
  }
  return target;
};

var addNewGoodsInCard = function (goods) {
  goods.orderedAmount = 1;
  goodsInCardCollection.push(goods);
  var goodsInCardElement = createGoodsInCardElement(goods);
  goodsCards.appendChild(goodsInCardElement);
  showOrderedAmountSumm();
};

var copyGoodsToCard = function (item, index) {
  var goodsCardCopy = Object.assign({}, item);
  goodsCardCopy.dataItem = index;
  disabledBuyForm(false);
  togglePayment(true);
  toggleDeliver(true);

  if (goodsInCardCollection.length === 0) {
    goodsCards.classList.remove('goods__cards--empty');
    goodsCards.querySelector('.goods__card-empty').classList.add('visually-hidden');
    addNewGoodsInCard(goodsCardCopy);
  } else {
    for (var i = 0; i < goodsInCardCollection.length; i++) {
      if (goodsInCardCollection[i].dataItem === goodsCardCopy.dataItem) {
        if (goodsInCardCollection[i].orderedAmount < goodsInCardCollection[i].amount) {
          goodsInCardCollection[i].orderedAmount++;
          showOrderedAmount(goodsInCardCollection[i]);
          showOrderedAmountSumm();
          return;
        } else {
          return;
        }
      }
    }
    addNewGoodsInCard(goodsCardCopy);
  }
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

var deleteGoodsInCard = function (index, elementCollection) {
  goodsInCardCollection.splice(index, 1);
  elementCollection[index].remove();
  showOrderedAmountSumm();
  if (goodsInCardCollection.length === 0) {
    disabledBuyForm(true);
    goodsCards.classList.add('goods__cards--empty');
    goodsCards.querySelector('.goods__card-empty').classList.remove('visually-hidden');
    basketCount.textContent = 'В корзине ничего нет';
  }
};

var createGoodsInCardElement = function (item) {
  var goodsInCardElement = goodsCardTemplate.cloneNode(true);

  goodsInCardElement.querySelector('.card-order__title').textContent = item.name;
  goodsInCardElement.querySelector('.card-order__img').src = item.picture;
  goodsInCardElement.querySelector('.card-order__img').alt = item.name;
  goodsInCardElement.querySelector('.card-order__price').textContent = item.price + ' ₽';
  goodsInCardElement.querySelector('.card-order__count').value = item.orderedAmount;
  goodsInCardElement.querySelector('.card-order__count').name = item.name;
  goodsInCardElement.dataset.item = item.dataItem;

  return goodsInCardElement;
};

var showOrderedAmount = function (item) {
  var activeCard = goodsCards.querySelector('[data-item="' + item.dataItem + '"]');
  activeCard.querySelector('.card-order__count').value = item.orderedAmount;
};

var showOrderedAmountSumm = function () {
  var orderedAmountSumm = 0;
  for (var i = 0; i < goodsInCardCollection.length; i++) {
    orderedAmountSumm += goodsInCardCollection[i].orderedAmount;
  }
  basketCount.textContent = 'Товаров в корзине: ' + orderedAmountSumm;
};

// переключение владки оплаты
var togglePayment = function (boolean) {
  if (boolean) {
    paymentCard.classList.remove('visually-hidden');
    paymentCash.classList.add('visually-hidden');
  } else {
    paymentCard.classList.add('visually-hidden');
    paymentCash.classList.remove('visually-hidden');
  }

  for (var i = 0; i < paymentCardInputs.length; i++) {
    paymentCardInputs[i].disabled = !boolean;
  }
};

payment.addEventListener('click', function (evt) {
  if (evt.target.id === 'payment__card') {
    togglePayment(true);
  } else if (evt.target.id === 'payment__cash') {
    togglePayment(false);
  }
});

// переключение владки доставки
var toggleDeliver = function (boolean) {
  if (boolean) {
    deliverStore.classList.remove('visually-hidden');
    deliverCourier.classList.add('visually-hidden');
  } else {
    deliverStore.classList.add('visually-hidden');
    deliverCourier.classList.remove('visually-hidden');
  }

  for (var i = 0; i < deliverСourierInputs.length; i++) {
    deliverСourierInputs[i].disabled = boolean;
  }

  for (var j = 0; j < deliverStoreInputs.length; j++) {
    deliverStoreInputs[j].disabled = !boolean;
  }
};

deliver.addEventListener('click', function (evt) {
  if (evt.target.id === 'deliver__store') {
    toggleDeliver(true);
  } else if (evt.target.id === 'deliver__courier') {
    toggleDeliver(false);
  }

  if (evt.target.classList.contains('input-btn__input')) {
    deliverStoreImg.src = 'img/map/' + evt.target.value + '.jpg';
    deliverStoreImg.alt = evt.target.value;
  }
});

// первая фаза работы фильтра по цене
(function () {
  var rangeFilter = document.querySelector('.range__filter');
  var rangeFilterWidth = getComputedStyle(rangeFilter).width.slice(0, -2);

  var rangeBtnLeft = document.querySelector('.range__btn--left');
  var rangeBtnRight = document.querySelector('.range__btn--right');
  var rangePriceMin = document.querySelector('.range__price--min');
  var rangePriceMax = document.querySelector('.range__price--max');

  rangeBtnLeft.addEventListener('mouseup', function () {
    var rangeBtnLeftX = getComputedStyle(rangeBtnLeft).left.slice(0, -2);
    rangePriceMin.textContent = rangeBtnLeftX / rangeFilterWidth * 100;
  });

  rangeBtnRight.addEventListener('mouseup', function () {
    var rangeBtnRightX = getComputedStyle(rangeBtnRight).right.slice(0, -2);
    rangePriceMax.textContent = 100 - rangeBtnRightX / rangeFilterWidth * 100;
  });
})();

// проверка банковской карты
(function () {
  var bankCardSucsessMessadge = document.querySelector('.payment__card-status');
  var bankCardErrorMessadge = document.querySelector('.payment__error-message');
  var cardNumberInput = document.querySelector('#payment__card-number');
  var cvcNumberInput = document.querySelector('#payment__card-cvc');

  // алгоритм Луна
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

  cardNumberInput.addEventListener('blur', function () {
    if (+cardNumberInput.value > 0) {
      if (!checkNumberByLun(cardNumberInput.value)) {
        cardNumberInput.style.borderColor = 'red';
        cardNumberInput.setCustomValidity('Неверный номер карты');
        bankCardErrorMessadge.classList.remove('visually-hidden');
      } else {
        cardNumberInput.style.borderColor = 'green';
        cardNumberInput.setCustomValidity('');
        bankCardSucsessMessadge.textContent = 'Одобрен';
        bankCardErrorMessadge.classList.add('visually-hidden');
      }
    } else {
      cardNumberInput.style.borderColor = 'red';
      cardNumberInput.setCustomValidity('Неверный номер карты');
    }
  });

  cvcNumberInput.addEventListener('blur', function () {
    var cvcNumber = +cvcNumberInput.value;
    if (cvcNumber < 100) {
      cvcNumberInput.style.borderColor = 'red';
      cvcNumberInput.setCustomValidity('CVC код должен быть от 100 до 999');
    } else {
      cvcNumberInput.style.borderColor = 'green';
      cvcNumberInput.setCustomValidity('');
    }
  });
})();


