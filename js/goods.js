'use strict';

(function () {
  var loadGoods = window.backend.load;
  var ESC_KEYCODE = window.utils.ESC_KEYCODE;
  var getDataItem = window.utils.getDataItem;
  var copyGoodToCard = window.cards.copyGoodToCard;
  var starsToClassName = window.utils.starsToClassName;
  var findPriceValue = window.findPriceValue;
  var findGoodsNumber = window.findGoodsNumber;

  var catalogCards = document.querySelector('.catalog__cards');
  var catalogCardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
  var emptyFiltersTemplate = document.querySelector('#empty-filters').content.querySelector('.catalog__empty-filter');

  var modalError = document.querySelector('.modal--error');
  var errorCloseBtn = modalError.querySelector('.modal__close');

  var favoriteInput = document.querySelector('#filter-favorite');
  var favoriteAmountValue = favoriteInput.parentNode.querySelector('.input-btn__item-count');

  var favoriteList = [];

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
    if (item.amount > 5) {
      return 'card--in-stock';
    } else if (item.amount <= 5 && item.amount >= 1) {
      return 'card--little';
    } else {
      return 'card--soon';
    }
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

    goodsElement.classList.remove('card--in-stock');
    goodsElement.classList.add(getClass(item));

    goodsElement.querySelector('.stars__rating').classList.remove('stars__rating--five');
    goodsElement.querySelector('.stars__rating').classList.add(starsToClassName[item.rating.value]);
    goodsElement.querySelector('.star__count').textContent = item.rating.number;
    goodsElement.querySelector('.card__characteristic').textContent = item.nutritionFacts.sugar ? 'Содержит сахар' : 'Без сахара';
    goodsElement.querySelector('.card__composition-list').textContent = item.nutritionFacts.contents;

    if (favoriteList.indexOf(item) !== -1) {
      goodsElement.querySelector('.card__btn-favorite').classList.add('card__btn-favorite--selected');
    }

    return goodsElement;
  };

  var createGoodsCollection = function (goods) {
    window.goodsData = goods;
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < goods.length; i++) {
      var newGoodsElement = createGoodsElement(goods[i]);
      fragment.appendChild(newGoodsElement);
    }

    catalogCards.appendChild(fragment);

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

  var updateGoodsCollection = function (newGoods) {
    catalogCards.innerHTML = '';
    if (newGoods.length === 0) {
      catalogCards.appendChild(emptyFiltersTemplate.cloneNode(true));
    } else {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < newGoods.length; i++) {
        fragment.appendChild(createGoodsElement(newGoods[i]));
      }
      catalogCards.appendChild(fragment);
    }
  };

  catalogCards.addEventListener('click', function (evt) {
    evt.preventDefault();

    var goodsData = window.goodsData;
    var cardName = getDataItem(evt, catalogCards, 'catalog__card', '.card__title');

    var goodsNames = goodsData.map(function (item) {
      return item.name;
    });

    var cardsIndex = goodsNames.indexOf(cardName);
    var activeCard = window.goodsData[cardsIndex];
    var allCardsElement = catalogCards.querySelectorAll('.catalog__card');

    // добавление в корзину
    if (evt.target.classList.contains('card__btn')) {
      if (activeCard.amount > 0) {
        copyGoodToCard(activeCard, cardName);
      }
    }

    // показать состав
    if (evt.target.classList.contains('card__btn-composition')) {
      allCardsElement[cardsIndex].querySelector('.card__composition').classList.toggle('card__composition--hidden');
    }

    // добавление в избранное
    if (evt.target.classList.contains('card__btn-favorite')) {
      evt.target.classList.toggle('card__btn-favorite--selected');

      var activeIndex = favoriteList.indexOf(activeCard);

      if (activeIndex === -1) {
        favoriteList.push(activeCard);
      } else {
        favoriteList.splice(activeIndex, 1);
      }

      favoriteAmountValue.textContent = '(' + favoriteList.length + ')';
    }
  });

  loadGoods(createGoodsCollection, showLoadError);

  window.goods = {
    updateGoodsCollection: updateGoodsCollection,
    favoriteList: favoriteList
  };
})();
