'use strict';

(function () {
  var catalogCards = document.querySelector('.catalog__cards');
  var catalogCardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');

  var buyForm = document.querySelector('.buy form');
  var buyFormInputs = buyForm.querySelectorAll('input');

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
    var activeCard = window.goodsData.goodsCollection[dataItem];

    // добавление в корзину
    if (evt.target.classList.contains('card__btn')) {
      evt.preventDefault();

      if (activeCard.amount > 0) {
        window.card.copyGoodsToCard(activeCard, dataItem);
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

  var disabledBuyForm = function (boolean) {
    for (var i = 0; i < buyFormInputs.length; i++) {
      buyFormInputs[i].disabled = boolean;
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
    goodsElement.querySelector('.card__img').src = item.picture;
    goodsElement.querySelector('.card__img').alt = item.name;
    goodsElement.querySelector('.card__price').innerHTML = item.price
      + ' <span class="card__currency">₽</span><span class="card__weight">'
      + item.weight
      + ' Г</span>';

    putClassOnElementAmount(goodsElement, item.amount);

    goodsElement.querySelector('.stars__rating').classList.remove('stars__rating--five');
    goodsElement.querySelector('.stars__rating').classList.add(window.goodsData.ratingStars[item.Rating.value]);
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

  (function () {
    catalogCards.appendChild(createGoodsFragment(window.goodsData.goodsCollection));

    catalogCards.classList.remove('catalog__cards--load');
    catalogCards.querySelector('.catalog__load').classList.add('visually-hidden');
  })();

  window.goods = {
    disabledBuyForm: disabledBuyForm
  };
})();
