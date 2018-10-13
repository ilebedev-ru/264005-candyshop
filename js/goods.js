'use strict';

(function () {
  var ESC_KEYCODE = window.utils.ESC_KEYCODE;

  var loadGoods = window.backend.load;
  var copyGoodToCard = window.cards.copyGoodToCard;
  var starsToClassName = window.utils.starsToClassName;
  var findPriceValue = window.findPriceValue;
  var findGoodsNumber = window.filter.findGoodsNumber;

  var catalogCards = document.querySelector('.catalog__cards');
  var catalogCardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
  var emptyFiltersTemplate = document.querySelector('#empty-filters').content.querySelector('.catalog__empty-filter');

  var modalError = document.querySelector('.modal--error');
  var errorCloseBtn = modalError.querySelector('.modal__close');

  var favoriteInput = document.querySelector('#filter-favorite');
  var favoriteAmountValue = favoriteInput.parentNode.querySelector('.input-btn__item-count');

  var favoriteGoods = [];

  catalogCardTemplate.classList.remove('card--in-stock');

  var clickErrCloseBtnHandler = function () {
    modalError.classList.add('modal--hidden');
  };

  var keydownEscModalHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      clickErrCloseBtnHandler();
      document.removeEventListener('keydown', keydownEscModalHandler);
    }
  };

  var getClass = function (item) {
    if (item > 5) {
      return 'card--in-stock';
    } else if (item <= 5 && item >= 1) {
      return 'card--little';
    }
    return 'card--soon';
  };

  var createGoodsElement = function (item) {
    var goodsElement = catalogCardTemplate.cloneNode(true);

    goodsElement.querySelector('.card__title').textContent = item.name;
    goodsElement.querySelector('.card__img').src = 'img/cards/' + item.picture;
    goodsElement.querySelector('.card__img').alt = item.name;
    goodsElement.querySelector('.card__price').innerHTML = item.price
      + ' <span class="card__currency">₽</span><span class="card__weight">'
      + item.weight
      + ' Г</span>';

    goodsElement.classList.add(getClass(item.amount));

    goodsElement.querySelector('.stars__rating').classList.remove('stars__rating--five');
    goodsElement.querySelector('.stars__rating').classList.add(starsToClassName[item.rating.value]);
    goodsElement.querySelector('.star__count').textContent = item.rating.number;
    goodsElement.querySelector('.card__characteristic').textContent = item.nutritionFacts.sugar ? 'Содержит сахар' : 'Без сахара';
    goodsElement.querySelector('.card__composition-list').textContent = item.nutritionFacts.contents;

    if (favoriteGoods.indexOf(item) !== -1) {
      goodsElement.querySelector('.card__btn-favorite').classList.add('card__btn-favorite--selected');
    }

    return goodsElement;
  };

  var appendFragment = function (goods) {
    var fragment = document.createDocumentFragment();

    goods.forEach(function (goodsItem) {
      fragment.appendChild(createGoodsElement(goodsItem));
    });

    catalogCards.appendChild(fragment);
  };

  var createGoodsCollection = function (goods) {
    window.goods.data = goods;

    appendFragment(goods);
    findPriceValue(goods);
    findGoodsNumber(goods);

    catalogCards.classList.remove('catalog__cards--load');
    catalogCards.querySelector('.catalog__load').classList.add('visually-hidden');
  };

  var showLoadError = function (errorMessage) {
    modalError.classList.remove('modal--hidden');
    modalError.querySelector('.modal__message').textContent = errorMessage;

    errorCloseBtn.addEventListener('click', clickErrCloseBtnHandler);
    document.addEventListener('keydown', keydownEscModalHandler);
  };

  var updateGoodsCollection = function (filters) {
    var goodsData = window.goods.data;
    var filterFunctions = window.filter.functions;

    catalogCards.innerHTML = '';

    var allFiltersKeys = Object.keys(filters).reverse();
    allFiltersKeys.forEach(function (key) {
      if (filters[key]) {
        goodsData = filterFunctions[key](goodsData, filters[key]);
      }
    });

    if (!goodsData.length) {
      catalogCards.appendChild(emptyFiltersTemplate.cloneNode(true));
      return;
    }

    appendFragment(goodsData);
  };

  var addToFavorite = function (evt, card) {
    evt.target.classList.toggle('card__btn-favorite--selected');

    var activeIndex = favoriteGoods.indexOf(card);

    if (activeIndex === -1) {
      favoriteGoods.push(card);
    } else {
      favoriteGoods.splice(activeIndex, 1);
    }

    favoriteAmountValue.textContent = '(' + favoriteGoods.length + ')';
  };

  var showComposition = function (elements, name) {
    var activeElement = Array.prototype.find.call(elements, function (element) {
      return element.querySelector('.card__title').textContent === name;
    });

    activeElement.querySelector('.card__composition').classList.toggle('card__composition--hidden');
  };

  catalogCards.addEventListener('click', function (evt) {
    evt.preventDefault();

    var goodsData = window.goods.data;
    var cardName = evt.target.closest('.catalog__card').querySelector('.card__title').textContent;

    var goodsNames = goodsData.map(function (item) {
      return item.name;
    });

    var cardsIndex = goodsNames.indexOf(cardName);
    var activeCard = window.goods.data[cardsIndex];
    var allCardsElement = catalogCards.querySelectorAll('.catalog__card');

    if (evt.target.classList.contains('card__btn')) {
      if (activeCard.amount > 0) {
        copyGoodToCard(activeCard, cardName);
      }
    }

    if (evt.target.classList.contains('card__btn-composition')) {
      showComposition(allCardsElement, cardName);
    }

    if (evt.target.classList.contains('card__btn-favorite')) {
      addToFavorite(evt, activeCard);
    }
  });

  loadGoods(createGoodsCollection, showLoadError);

  window.goods = {
    data: null,
    updateCollection: updateGoodsCollection,
    favorite: favoriteGoods
  };
})();
