'use strict';

(function () {
  var getDataItem = window.utils.getDataItem;
  var getArrIndex = window.utils.getArrIndex;
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
    for (var i = 0; i < buyFormInputs.length; i++) {
      buyFormInputs[i].disabled = boolean;
    }
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
    if (item) {
      var allCards = goodsCards.querySelectorAll('.card-order');
      var allCardsTitles = goodsCards.querySelectorAll('.card-order__title');

      for (var i = 0; i < allCardsTitles.length; i++) {
        if (allCardsTitles[i].textContent === item.name) {
          var activeCard = allCards[i];
        }
      }
      activeCard.querySelector('.card-order__count').value = item.orderedAmount;
    }
    showOrderedAmountSum();
  };

  var addNewGoodsInCard = function (goods) {
    goods.orderedAmount = 1;
    goodsInCardCollection.push(goods);
    var goodsInCardElement = createGoodsInCardElement(goods);
    goodsCards.appendChild(goodsInCardElement);
    showOrderedAmount();
  };

  var copyGoodsToCard = function (item, index) {
    var goodsCardCopy = Object.assign({}, item);
    goodsCardCopy.dataItem = index;
    disabledBuyForm(false);
    togglePayment('payment__card');
    toggleDeliver('deliver__store');

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
            return;
          }
          return;
        }
      }
      addNewGoodsInCard(goodsCardCopy);
    }
  };

  var deleteGoodsInCard = function (index, elementCollection) {
    goodsInCardCollection.splice(index, 1);
    elementCollection[index].remove();
    showOrderedAmount();
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

    for (var i = 0; i < allGoodsInCardElement.length; i++) {
      allGoodsInCardElement[i].remove();
    }

    showOrderedAmount();
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

  goodsCards.addEventListener('click', function (evt) {
    var dataItemInCard = getDataItem(evt, goodsCards, 'goods_card', '.card-order__title');
    var cardCollectionIndex = getArrIndex(goodsInCardCollection, dataItemInCard);
    var activeItemInCard = goodsInCardCollection[cardCollectionIndex];
    var allGoodsInCardElement = goodsCards.querySelectorAll('.card-order');

    // удаление товара
    if (evt.target.classList.contains('card-order__close')) {
      evt.preventDefault();
      deleteGoodsInCard(cardCollectionIndex, allGoodsInCardElement);
    }

    // уменьшение количества
    if (evt.target.classList.contains('card-order__btn--decrease')) {
      if (activeItemInCard.orderedAmount > 0) {
        activeItemInCard.orderedAmount -= 1;
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
        showOrderedAmount(activeItemInCard);
      }
    }
  });

  window.cards = {
    copyGoodsToCard: copyGoodsToCard,
    clearCard: clearCard
  };
})();
