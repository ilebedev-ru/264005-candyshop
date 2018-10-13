'use strict';

(function () {
  var togglePayment = window.orderFormValidate.togglePayment;
  var toggleDeliver = window.orderFormValidate.toggleDeliver;

  var buyForm = document.querySelector('.buy form');
  var buyFormInputs = buyForm.querySelectorAll('input');
  var submitButton = buyForm.querySelector('.buy__submit-btn');

  var goodsCardTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
  var goodsCards = document.querySelector('.goods__cards');
  var basketCount = document.querySelector('.main-header__basket');
  var goodsCardsEmptyMessage = goodsCards.querySelector('.goods__card-empty');

  var goodsCardsTotal = document.querySelector('.goods__total');
  var goodsCardsOrgerLink = goodsCardsTotal.querySelector('.goods__order-link');
  var goodsCardsCount = goodsCardsTotal.querySelector('.goods__total-count');

  var inCardCollectionGoods = [];

  var switchEmptyCartState = function (boolean) {
    if (boolean) {
      goodsCards.classList.add('goods__cards--empty');
      goodsCardsEmptyMessage.classList.remove('visually-hidden');
      goodsCardsTotal.classList.add('visually-hidden');
      goodsCardsOrgerLink.classList.add('goods__order-link--disabled');
    } else {
      goodsCards.classList.remove('goods__cards--empty');
      goodsCardsEmptyMessage.classList.add('visually-hidden');
      goodsCardsTotal.classList.remove('visually-hidden');
      goodsCardsOrgerLink.classList.remove('goods__order-link--disabled');
    }
  };

  var disableBuyForm = function (boolean) {
    Array.prototype.forEach.call(buyFormInputs, function (input) {
      input.disabled = boolean;
    });
    submitButton.disabled = boolean;
  };

  disableBuyForm(true);

  var showOrderedAmountSum = function () {
    var orderedAmountSumm = 0;
    var orderedPriceSumm = 0;

    Array.prototype.forEach.call(inCardCollectionGoods, function (card) {
      orderedAmountSumm += card.orderedAmount;
      orderedPriceSumm += card.price * card.orderedAmount;
    });

    basketCount.textContent = 'Товаров в корзине: ' + orderedAmountSumm + ' на сумму ' + orderedPriceSumm + '₽';
    goodsCardsCount.textContent = 'Итого товаров: ' + orderedAmountSumm + ' на сумму ' + orderedPriceSumm + ' ₽';
  };

  var showOrderedAmount = function (item) {
    var allCards = goodsCards.querySelectorAll('.card-order');
    var allCardsTitles = Array.from(goodsCards.querySelectorAll('.card-order__title'));

    var activeCardIndex = allCardsTitles.findIndex(function (title) {
      return title.textContent === item.name;
    });

    allCards[activeCardIndex].querySelector('.card-order__count').value = item.orderedAmount;

    showOrderedAmountSum();
  };

  var deleteGoodInCard = function (element) {
    var inCardAllGoods = goodsCards.querySelectorAll('.card-order');
    var elementIndex = inCardCollectionGoods.indexOf(element);

    inCardCollectionGoods.splice(elementIndex, 1);
    inCardAllGoods[elementIndex].remove();
    showOrderedAmountSum();

    if (!inCardCollectionGoods.length) {

      disableBuyForm(true);
      switchEmptyCartState(true);

      basketCount.textContent = 'В корзине ничего нет';
    }
  };

  var clearCard = function () {
    var inCardAllGoods = goodsCards.querySelectorAll('.card-order');
    inCardCollectionGoods.splice(0, inCardCollectionGoods.length);

    Array.prototype.forEach.call(inCardAllGoods, function (goods) {
      goods.remove();
    });

    showOrderedAmountSum();
    disableBuyForm(true);
    switchEmptyCartState(true);

    basketCount.textContent = 'В корзине ничего нет';
  };

  var createGoodsInCardElement = function (item) {
    var goodsInCardElement = goodsCardTemplate.cloneNode(true);

    goodsInCardElement.querySelector('.card-order__title').textContent = item.name;
    goodsInCardElement.querySelector('.card-order__img').src = 'img/cards/' + item.picture;
    goodsInCardElement.querySelector('.card-order__img').alt = item.name;
    goodsInCardElement.querySelector('.card-order__price').textContent = item.price + ' ₽';
    goodsInCardElement.querySelector('.card-order__count').value = item.orderedAmount;
    goodsInCardElement.querySelector('.card-order__count').name = item.name;

    return goodsInCardElement;
  };

  var incrementGoodInCard = function (good) {
    if (good.orderedAmount < good.amount) {
      good.orderedAmount++;
      showOrderedAmount(good);
    }
  };

  var decrementGoodInCard = function (good) {
    if (good.orderedAmount > 1) {
      good.orderedAmount -= 1;
      showOrderedAmount(good);
    } else {
      deleteGoodInCard(good);
    }
  };

  var addNewGoodInCard = function (good) {
    good.orderedAmount = 1;
    inCardCollectionGoods.push(good);

    var goodsInCardElement = createGoodsInCardElement(good);

    goodsCards.appendChild(goodsInCardElement);
    showOrderedAmountSum();
  };

  var copyGoodToCard = function (item) {
    var goodsCardCopy = Object.assign({}, item);

    disableBuyForm(false);
    togglePayment('payment__card');
    toggleDeliver('deliver__store');

    if (!inCardCollectionGoods.length) {

      switchEmptyCartState(false);
      addNewGoodInCard(goodsCardCopy);

    } else {
      var goodInCard = inCardCollectionGoods.find(function (cardGood) {
        return cardGood.name === item.name;
      });

      if (goodInCard) {
        incrementGoodInCard(goodInCard);
      } else {
        addNewGoodInCard(goodsCardCopy);
      }
    }
  };

  goodsCards.addEventListener('click', function (evt) {
    var nameItemInCard = evt.target.closest('.goods_card').querySelector('.card-order__title').textContent;

    var cardGoodsNames = inCardCollectionGoods.map(function (item) {
      return item.name;
    });

    var cardsIndex = cardGoodsNames.indexOf(nameItemInCard);
    var activeItemInCard = inCardCollectionGoods[cardsIndex];

    if (evt.target.classList.contains('card-order__close')) {
      evt.preventDefault();
      deleteGoodInCard(activeItemInCard);
    }

    if (evt.target.classList.contains('card-order__btn--decrease')) {
      decrementGoodInCard(activeItemInCard);
    }

    if (evt.target.classList.contains('card-order__btn--increase')) {
      incrementGoodInCard(activeItemInCard);
    }
  });

  window.cards = {
    copyGoodToCard: copyGoodToCard,
    clearCard: clearCard
  };
})();
