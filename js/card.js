'use strict';

(function () {
  var getDataItem = window.utils.getDataItem;
  var getArrIndex = window.utils.getArrIndex;
  var togglePayment = window.orderFormValidate.togglePayment;
  var toggleDeliver = window.orderFormValidate.toggleDeliver;

  var buyForm = document.querySelector('.buy form');
  var buyFormInputs = buyForm.querySelectorAll('input');

  var goodsInCardCollection = [];
  var goodsCardTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
  var goodsCards = document.querySelector('.goods__cards');
  var basketCount = document.querySelector('.main-header__basket');

  var disabledBuyForm = function (boolean) {
    for (var i = 0; i < buyFormInputs.length; i++) {
      buyFormInputs[i].disabled = boolean;
    }
  };

  disabledBuyForm(true);

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
            showOrderedAmountSumm();
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

  goodsCards.addEventListener('click', function (evt) {
    var dataItemInCard = getDataItem(evt, goodsCards, 'goods_card');
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

  window.copyGoodsToCard = copyGoodsToCard;
})();