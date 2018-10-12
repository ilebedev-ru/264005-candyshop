'use strict';

(function () {
  var findPriceValue = window.findPriceValue;
  var getUnique = window.utils.getUnique;

  var filterArea = document.querySelector('.catalog__sidebar');
  var filteredGoods = [];

  var typeFilterInputs = filterArea.querySelectorAll('input[name="food-type"]');

  var propertyFilterInputs = filterArea.querySelectorAll('input[name="food-property"]');
  var nutritionFacts = ['sugar', 'vegetarian', 'gluten'];
  var nutritionFactsCounts = [0, 0, 0];

  var favoriteInput = filterArea.querySelector('#filter-favorite');
  var availabilityInput = filterArea.querySelector('#filter-availability');
  var availabilityAmount = 0;

  var sortFilterInputs = filterArea.querySelectorAll('input[name="sort"]');
  var filterSubmitButton = document.querySelector('.catalog__submit');

  var typeInputsContainers = Array.prototype.map.call(typeFilterInputs, function (input) {
    return input.parentNode;
  });

  var propertyInputsContainers = Array.prototype.map.call(propertyFilterInputs, function (input) {
    return input.parentNode;
  });

  var findGoodsNumber = function (goods) {
    // тип товара
    typeInputsContainers.forEach(function (item) {
      var typeName = item.querySelector('label').textContent;
      var goodsNum = goods.filter(function (good) {
        return good.kind === typeName;
      }).length;

      item.querySelector('.input-btn__item-count').textContent = '(' + goodsNum + ')';
    });

    // характеристика товара
    goods.forEach(function (item, i) {
      nutritionFacts.forEach(function (fact, j) {

        if (fact === 'vegetarian') {
          if (goods[i].nutritionFacts[fact] === true) {
            nutritionFactsCounts[j]++;
          }
        } else {
          if (goods[i].nutritionFacts[fact] === false) {
            nutritionFactsCounts[j]++;
          }
        }
      });
    });

    propertyInputsContainers.forEach(function (item, i) {
      item.querySelector('.input-btn__item-count').textContent = '(' + nutritionFactsCounts[i] + ')';
    });

    // избранное
    favoriteInput.parentNode.querySelector('.input-btn__item-count').textContent = '(0)';

    // наличие
    goods.forEach(function (item) {
      if (item.amount > 0) {
        availabilityAmount++;
      }
    });

    availabilityInput.parentNode.querySelector('.input-btn__item-count').textContent = '(' + availabilityAmount + ')';
  };

  var getActivInputsValue = function (inputs, activeInputs) {
    Array.prototype.forEach.call(inputs, function (input) {
      if (input.checked === true) {
        activeInputs.push(input.value);
      }
    });
  };

  var resetFilters = function () {
    Array.prototype.forEach.call(typeFilterInputs, function (input) {
      input.checked = false;
    });

    Array.prototype.forEach.call(propertyFilterInputs, function (input) {
      input.checked = false;
    });

    sortFilterInputs[0].checked = true;
  };

  var applyFilterToType = function (evt, goods) {
    var activeTypeInputs = [];
    getActivInputsValue(typeFilterInputs, activeTypeInputs);
    if (activeTypeInputs.length === 0) {
      return goods;
    }

    var activeNames = activeTypeInputs.map(function (item) {
      return filterArea.querySelector('label[for="filter-' + item + '"]').textContent;
    });

    var filterToTypeArray = [];
    for (var i = 0; i < activeNames.length; i++) {
      filterToTypeArray = filterToTypeArray.concat(goods.filter(function (item) {
        return item.kind === activeNames[i];
      }));
    }
    return filterToTypeArray;
  };

  var applyFilterToProperty = function (evt, goods) {
    var activePropInputs = [];
    getActivInputsValue(propertyFilterInputs, activePropInputs);
    if (activePropInputs.length === 0) {
      return goods;
    }

    var filterArray = [];
    for (var k = 0; k < activePropInputs.length; k++) {
      if (activePropInputs[k] === 'sugar-free') {
        filterArray = filterArray.concat(goods.filter(function (item) {
          return item.nutritionFacts.sugar === false;
        }));
      } else if (activePropInputs[k] === 'vegetarian') {
        filterArray = filterArray.concat(goods.filter(function (item) {
          return item.nutritionFacts.vegetarian === true;
        }));
      } else if (activePropInputs[k] === 'gluten-free') {
        filterArray = filterArray.concat(goods.filter(function (item) {
          return item.nutritionFacts.gluten === false;
        }));
      }
    }

    return getUnique(filterArray);
  };

  var applyFilterToPrice = function (evt, goods) {
    var rangePriceMin = document.querySelector('.range__price--min').textContent;
    var rangePriceMax = document.querySelector('.range__price--max').textContent;

    filteredGoods = goods.filter(function (item) {
      return item.price <= rangePriceMax;
    });

    filteredGoods = filteredGoods.filter(function (item) {
      return item.price >= rangePriceMin;
    });

    return filteredGoods;
  };

  var sortFilter = function (evt, goods) {
    for (var i = 0; i < sortFilterInputs.length; i++) {
      if (sortFilterInputs[i].checked) {
        if (sortFilterInputs[i].value === 'popular') {
          filteredGoods = goods.sort(function (a, b) {
            return b.rating.number - a.rating.number;
          });
        }

        if (sortFilterInputs[i].value === 'expensive') {
          filteredGoods = goods.sort(function (a, b) {
            return b.price - a.price;
          });
        }

        if (sortFilterInputs[i].value === 'cheep') {
          filteredGoods = goods.sort(function (a, b) {
            return a.price - b.price;
          });
        }

        if (sortFilterInputs[i].value === 'rating') {
          filteredGoods = goods.sort(function (a, b) {
            return b.rating.value - a.rating.value;
          });
        }
      }
    }

    return filteredGoods;
  };

  var activeFilters = [applyFilterToType, applyFilterToProperty, applyFilterToPrice, sortFilter];

  var clickFilterHandler = function (evt) {
    if (evt.target.classList.contains('input-btn__input') ||
        evt.target.classList.contains('range__btn') ||
        evt.target.classList.contains('range__filter') ||
        evt.target.classList.contains('range__fill-line')) {

      var updateGoodsCollection = window.goods.updateGoodsCollection;
      var goods = window.goodsData;
      var favoriteList = window.goods.favoriteList;

      filteredGoods = (favoriteInput.checked && favoriteList) ? favoriteList : goods;

      activeFilters.forEach(function (func) {
        filteredGoods = func(evt, filteredGoods);
      });

      if (evt.target === favoriteInput) {
        findPriceValue(goods);
        resetFilters();

        if (favoriteInput.checked) {
          availabilityInput.checked = false;

          filteredGoods = (favoriteList) ? favoriteList : [];

        } else {
          filteredGoods = goods;
        }
      }

      if (evt.target === availabilityInput) {
        resetFilters();
        findPriceValue(goods);

        if (availabilityInput.checked) {
          favoriteInput.checked = false;

          filteredGoods = goods.filter(function (item) {
            return item.amount > 0;
          });
        }
      }

      window.utils.debounce(updateGoodsCollection, filteredGoods);
    }
  };

  var clickSubmitBtnHandler = function (evt) {
    var updateGoodsCollection = window.goods.updateGoodsCollection;
    var goods = window.goodsData;

    evt.preventDefault();
    findPriceValue(goods);
    resetFilters();
    favoriteInput.checked = false;
    availabilityInput.checked = false;
    filteredGoods = goods;

    window.utils.debounce(updateGoodsCollection, filteredGoods);
  };

  filterArea.addEventListener('click', clickFilterHandler);
  filterSubmitButton.addEventListener('click', clickSubmitBtnHandler);

  window.findGoodsNumber = findGoodsNumber;
})();
