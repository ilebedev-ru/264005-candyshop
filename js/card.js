'use strict';

(function () {
  var getDataItem = window.utils.getDataItem;
  var togglePayment = window.orderFormValidate.togglePayment;
  var toggleDeliver = window.orderFormValidate.toggleDeliver;

  var buyForm = document.querySelector('.buy form');
  var buyFormInputs = buyForm.querySelectorAll('input');
  var submitButton = buyForm.querySelector('.buy__submit-btn');

  var goodsInCardCollection = [];
  var goodsCardTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
  var goodsCards = document.querySelector('.goods__cards');
  var basketCount = document.querySelector('.main-header__basket');

  var disabledBuyForm = function (boolean) {
    Array.prototype.forEach.call(buyFormInputs, function (input) {
      input.disabled = boolean;
    });
    submitButton.disabled = boolean;
  };

  disabledBuyForm(true);

  var showOrderedAmountSum = function () {
    var orderedAmountSumm = 0;
    for (var i = 0; i < goodsInCardCollection.length; i++) {
      orderedAmountSumm += goodsInCardCollection[i].orderedAmount;
    }
    basketCount.textContent = 'Товаров в корзине: ' + orderedAmountSumm;
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
    var allGoodsInCardElement = goodsCards.querySelectorAll('.card-order');
    var elementIndex = goodsInCardCollection.indexOf(element);

    goodsInCardCollection.splice(elementIndex, 1);
    allGoodsInCardElement[elementIndex].remove();
    showOrderedAmountSum();

    if (goodsInCardCollection.length === 0) {
      disabledBuyForm(true);
      goodsCards.classList.add('goods__cards--empty');
      goodsCards.querySelector('.goods__card-empty').classList.remove('visually-hidden');
      basketCount.textContent = 'В корзине ничего нет';
    }
  };

  var clearCard = function () {
    var allGoodsInCardElement = goodsCards.querySelectorAll('.card-order');
    goodsInCardCollection.splice(0, goodsInCardCollection.length);

    Array.prototype.forEach.call(allGoodsInCardElement, function (goods) {
      goods.remove();
    });

    showOrderedAmountSum();
    disabledBuyForm(true);

    goodsCards.classList.add('goods__cards--empty');
    goodsCards.querySelector('.goods__card-empty').classList.remove('visually-hidden');
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
    goodsInCardCollection.push(good);

    var goodsInCardElement = createGoodsInCardElement(good);

    goodsCards.appendChild(goodsInCardElement);
    showOrderedAmountSum();
  };

  var copyGoodToCard = function (item) {
    var goodsCardCopy = Object.assign({}, item);

    disabledBuyForm(false);
    togglePayment('payment__card');
    toggleDeliver('deliver__store');

    if (goodsInCardCollection.length === 0) {

      goodsCards.classList.remove('goods__cards--empty');
      goodsCards.querySelector('.goods__card-empty').classList.add('visually-hidden');
      addNewGoodInCard(goodsCardCopy);

    } else {
      var goodInCard = goodsInCardCollection.find(function (cardGood) {
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
    var nameItemInCard = getDataItem(evt, goodsCards, 'goods_card', '.card-order__title');

    var cardGoodsNames = goodsInCardCollection.map(function (item) {
      return item.name;
    });

    var cardsIndex = cardGoodsNames.indexOf(nameItemInCard);
    var activeItemInCard = goodsInCardCollection[cardsIndex];

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
