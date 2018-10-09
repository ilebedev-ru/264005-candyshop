'use strict';

(function () {
  var ESC_KEYCODE = window.utils.ESC_KEYCODE;
  var getDataItem = window.utils.getDataItem;
  var copyGoodsToCard = window.cards.copyGoodsToCard;
  var starsToClassName = window.utils.starsToClassName;
  var findPriceValue = window.findPriceValue;

  var catalogCards = document.querySelector('.catalog__cards');
  var catalogCardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');

  var modalError = document.querySelector('.modal--error');
  var errorCloseBtn = modalError.querySelector('.modal__close');

  var clickErrCloseBtnHandler = function () {
    modalError.classList.add('modal--hidden');
  };

  var keydownEscModalHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      clickErrCloseBtnHandler();
      document.removeEventListener('keydown', keydownEscModalHandler);
    }
  };

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
    goodsElement.querySelector('.card__img').src = 'img/cards/' + item.picture;
    goodsElement.querySelector('.card__img').alt = item.name;
    goodsElement.querySelector('.card__price').innerHTML = item.price
      + ' <span class="card__currency">₽</span><span class="card__weight">'
      + item.weight
      + ' Г</span>';

    putClassOnElementAmount(goodsElement, item.amount);

    goodsElement.querySelector('.stars__rating').classList.remove('stars__rating--five');
    goodsElement.querySelector('.stars__rating').classList.add(starsToClassName[item.rating.value]);
    goodsElement.querySelector('.star__count').textContent = item.rating.number;
    goodsElement.querySelector('.card__characteristic').textContent = item.nutritionFacts.sugar ? 'Содержит сахар' : 'Без сахара';
    goodsElement.querySelector('.card__composition-list').textContent = item.nutritionFacts.contents;
    goodsElement.dataset.item = i;

    return goodsElement;
  };

  var createGoodsCollection = function (goods) {
    window.goodsData = goods;
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < goods.length; i++) {
      fragment.appendChild(createGoodsElement(goods[i], i));
    }

    catalogCards.appendChild(fragment);

    findPriceValue(goods);

    catalogCards.classList.remove('catalog__cards--load');
    catalogCards.querySelector('.catalog__load').classList.add('visually-hidden');
  };

  var showLoadError = function (errorMessage) {
    modalError.classList.remove('modal--hidden');
    modalError.querySelector('.modal__message').textContent = errorMessage;

    errorCloseBtn.addEventListener('click', clickErrCloseBtnHandler);
    document.addEventListener('keydown', keydownEscModalHandler);
  };

  window.backend.load(createGoodsCollection, showLoadError);

  catalogCards.addEventListener('click', function (evt) {
    var dataItem = getDataItem(evt, catalogCards, 'catalog__card');
    var activeCard = window.goodsData[dataItem];

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
