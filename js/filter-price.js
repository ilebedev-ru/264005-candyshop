'use strict';

(function () {
  var PIN_WIDTH = 10;

  var GoodsData = window.utils.GoodsData;

  var rangeFilter = document.querySelector('.range__filter');
  var rangeFilterWidth = getComputedStyle(rangeFilter).width.slice(0, -2);
  var rangeLine = document.querySelector('.range__fill-line');

  var rangeBtnLeft = document.querySelector('.range__btn--left');
  var rangeBtnRight = document.querySelector('.range__btn--right');

  var rangePriceMin = document.querySelector('.range__price--min');
  var rangePriceMax = document.querySelector('.range__price--max');

  var coordFieldMax = rangeFilter.offsetLeft + +rangeFilterWidth;
  var coordFieldMin = rangeFilter.offsetLeft;

  var moveFlag = false;

  var mouseDownHandler = function (evt) {
    evt.preventDefault();
    var startCoordsX = evt.clientX;

    var pinOptions = {};
    if (evt.target.offsetLeft === rangeBtnLeft.offsetLeft) {
      pinOptions = {
        side: 'left',
        minX: 0,
        maxX: rangeBtnRight.offsetLeft - PIN_WIDTH,
        coordXMax: coordFieldMin + rangeBtnRight.offsetLeft,
        coordXMin: coordFieldMin
      };
    } else if (evt.target.offsetLeft === rangeBtnRight.offsetLeft) {
      pinOptions = {
        side: 'right',
        minX: rangeBtnLeft.offsetLeft + PIN_WIDTH,
        maxX: +rangeFilterWidth,
        coordXMax: coordFieldMax,
        coordXMin: coordFieldMin + rangeBtnLeft.offsetLeft
      };
    }

    var mouseMoveHandler = function (moveEvt) {
      moveFlag = true;
      var shiftX = startCoordsX - moveEvt.clientX;

      startCoordsX = moveEvt.clientX;
      if (startCoordsX > pinOptions.coordXMax) {
        startCoordsX = pinOptions.coordXMax;
      } else if (startCoordsX < pinOptions.coordXMin) {
        startCoordsX = pinOptions.coordXMin;
      }

      var newX = (evt.target.offsetLeft - shiftX);
      if (newX < pinOptions.minX) {
        newX = pinOptions.minX;
      } else if (newX > pinOptions.maxX) {
        newX = pinOptions.maxX;
      }

      var newValue = newX / rangeFilterWidth * 100;
      var priceValue = Math.round(GoodsData.PRICES.max * newValue / 100);
      evt.target.style.left = newValue + '%';

      if (pinOptions.side === 'left') {
        rangeLine.style.left = newValue + '%';
        rangePriceMin.textContent = priceValue;
      }

      if (pinOptions.side === 'right') {
        rangeLine.style.right = (100 - newValue) + '%';
        rangePriceMax.textContent = priceValue;
      }

    };

    var mouseUpHandler = function () {
      if (pinOptions.side === 'left') {
        rangePriceMin.textContent = Math.round(GoodsData.PRICES.max * evt.target.offsetLeft / rangeFilterWidth);
      }

      if (pinOptions.side === 'right') {
        rangePriceMax.textContent = Math.round(GoodsData.PRICES.max * evt.target.offsetLeft / rangeFilterWidth);
      }

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mousemove', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  var filterDownHandler = function (evt) {
    evt.preventDefault();
    moveFlag = false;

    var filterUpHandler = function () {
      if (moveFlag === false) {
        var newX = evt.clientX - coordFieldMin - PIN_WIDTH / 2;
        newX = (newX < 0) ? 0 : newX;

        var newValue = newX / rangeFilterWidth * 100;
        var priceValue = Math.round(GoodsData.PRICES.max * newValue / 100);

        var changeValue = function (side) {
          if (side === 'left') {
            rangeBtnLeft.style.left = newValue + '%';
            rangeLine.style.left = newValue + '%';
            rangePriceMin.textContent = priceValue;
          }

          if (side === 'right') {
            rangeBtnRight.style.left = newValue + '%';
            rangeLine.style.right = (100 - newValue) + '%';
            rangePriceMax.textContent = priceValue;
          }
        };

        if (newX < (rangeFilterWidth / 2)) {
          changeValue((newX < rangeBtnRight.offsetLeft) ? 'left' : 'right');
        } else {
          changeValue((newX > rangeBtnLeft.offsetLeft) ? 'right' : 'left');
        }
      }
      document.removeEventListener('mouseup', filterUpHandler);
    };
    document.addEventListener('mouseup', filterUpHandler);
  };

  rangeBtnLeft.addEventListener('mousedown', mouseDownHandler);
  rangeBtnRight.addEventListener('mousedown', mouseDownHandler);

  rangeFilter.addEventListener('mousedown', filterDownHandler);
})();
