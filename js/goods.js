'use strict';

(function () {
  var GoodsData = window.utils.GoodsData;
  var shuffleArray = window.utils.shuffleArray;
  var getRandomNumber = window.utils.getRandomNumber;
  var getRandomBoolean = window.utils.getRandomBoolean;
  var getRandomContent = window.utils.getRandomContent;
  var getDataItem = window.utils.getDataItem;
  var copyGoodsToCard = window.copyGoodsToCard;
  var starsToClassName = window.utils.starsToClassName;

  var catalogCards = document.querySelector('.catalog__cards');
  var catalogCardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');

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
    goodsElement.querySelector('.stars__rating').classList.add(starsToClassName[item.Rating.value]);
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
  catalogCards.appendChild(createGoodsFragment(goodsCollection));
  catalogCards.classList.remove('catalog__cards--load');
  catalogCards.querySelector('.catalog__load').classList.add('visually-hidden');

  catalogCards.addEventListener('click', function (evt) {
    var dataItem = getDataItem(evt, catalogCards, 'catalog__card');
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
})();
