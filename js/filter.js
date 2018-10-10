'use strict';

(function () {
  findPriceValue = window.findPriceValue;

  var filterArea = document.querySelector('.catalog__sidebar');
  var filteredGoods = [];

  var typeFilterInputs = filterArea.querySelectorAll('input[name="food-type"]');
  var typeInputsContainers = [];

  var propertyFilterInputs = filterArea.querySelectorAll('input[name="food-property"]');
  var nutritionFacts = ['sugar', 'vegetarian', 'gluten'];
  var nutritionFactsCounts = [0, 0, 0];
  var propertyInputsContainers = [];

  var favoriteInput = filterArea.querySelector('#filter-favorite');
  var availabilityInput = filterArea.querySelector('#filter-availability');
  var availabilityAmount = 0;

  var filterSubmitButton = document.querySelector('.catalog__submit');

  for (var i = 0; i < typeFilterInputs.length; i++) {
    typeInputsContainers[i] = typeFilterInputs[i].parentNode;
  };

  for (var i = 0; i < propertyFilterInputs.length; i++) {
    propertyInputsContainers[i] = propertyFilterInputs[i].parentNode;
  };

  var compareNumeric = function (a, b) {
    if (a > b) return 1;
    if (a < b) return -1;
  };

  var findGoodsNumber = function (goods) {
    // тип товара
    typeInputsContainers.forEach(function (item) {
      var typeName = item.querySelector('label').textContent;
      var i = 0;
      goods.forEach(function (item) {
        if(item.kind === typeName) {
          i++;
        }
        return i;
      });
      item.querySelector('.input-btn__item-count').textContent = '(' + i + ')'
    });

    // характеристика товара
    goods.forEach(function (item, i) {
      nutritionFacts.forEach(function (item, j) {

        if (item === 'vegetarian') {
          if (goods[i].nutritionFacts[item] === true) {
            nutritionFactsCounts[j]++;
          }
        } else {
          if (goods[i].nutritionFacts[item] === false) {
            nutritionFactsCounts[j]++;
          }
        }
      })
    });

    propertyInputsContainers.forEach(function (item, i) {
      item.querySelector('.input-btn__item-count').textContent = '(' + nutritionFactsCounts[i] + ')'
    })

    //избранное
    favoriteInput.parentNode.querySelector('.input-btn__item-count').textContent = '(0)';

    //наличие
    goods.forEach(function(item) {
      if (item.amount > 0) {
        availabilityAmount++
      };
    });

    availabilityInput.parentNode.querySelector('.input-btn__item-count').textContent = '(' + availabilityAmount + ')';
  };

   var getActivInputsValue = function (inputs, activeInputs) {
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].checked === true) {
        activeInputs.push(inputs[i].value);
      }
    };
  };

  var applyFilterToType = function(evt, goods) {
    var activeTypeInputs = [];
    getActivInputsValue(typeFilterInputs, activeTypeInputs);
    if (activeTypeInputs.length === 0) {
      return goods;
    }

    var activeNames = activeTypeInputs.map(function(item) {
        return filterArea.querySelector('label[for="filter-' + item + '"]').textContent;
      });

    var filterArray = [];
    for (var i = 0; i < activeNames.length; i++) {
      filterArray = filterArray.concat(goods.filter(function (item) {
        return item.kind === activeNames[i];
      }));
    }
    return filterArray;
  };

  var applyFilterToProperty = function(evt, goods) {
    var activePropInputs = [];
    getActivInputsValue(propertyFilterInputs, activePropInputs);
    if (activePropInputs.length === 0) {
      return goods;
    };

    console.log(activePropInputs);

    var filterArray = [];
    for (var i = 0; i < activePropInputs.length; i++) {
      if (activePropInputs[i] === 'sugar-free') {
        filterArray = filterArray.concat(goods.filter(function (item) {
        return item.nutritionFacts.sugar === false;
        }));
      } else if (activePropInputs[i] === 'vegetarian') {
        filterArray = filterArray.concat(goods.filter(function (item) {
        return item.nutritionFacts.vegetarian === true;
        }));
      } else if (activePropInputs[i] === 'gluten-free') {
        filterArray = filterArray.concat(goods.filter(function (item) {
        return item.nutritionFacts.gluten === false;
        }));
      }
    }

    return filterArray;
  };

  var applyFilterToPrice = function (evt, goods) {
    var rangePriceMin = document.querySelector('.range__price--min').textContent;
    var rangePriceMax = document.querySelector('.range__price--max').textContent;

    filteredGoods = goods.filter(function(item) {
      return item.price <= rangePriceMax
    });

    filteredGoods = filteredGoods.filter(function(item) {
      return item.price >= rangePriceMin
    });

    return filteredGoods;
  };

  var sortFilter = function (evt, goods) {
    if (evt.target.value === 'popular') {
      filteredGoods = goods.sort(function(a, b) {
        return b.rating.number - a.rating.number;
      })
    }

    if (evt.target.value === 'expensive') {
      filteredGoods = goods.sort(function(a, b) {
        return b.price - a.price;
      })
    }

    if (evt.target.value === 'cheep') {
      filteredGoods = goods.sort(function(a, b) {
        return a.price - b.price;
      })
    }

    if (evt.target.value === 'rating') {
      filteredGoods = goods.sort(function(a, b) {
        return b.rating.value - a.rating.value;
      })
    }

    return filteredGoods;
  };

  var activeFilters = [applyFilterToType, applyFilterToProperty, applyFilterToPrice, sortFilter];


  filterArea.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('input-btn__input') ||
        evt.target.classList.contains('range__btn') ||
        evt.target.classList.contains('range__filter') ||
        evt.target.classList.contains('range__fill-line') ||
        evt.target.classList.contains('catalog__submit')) {

      var updateGoodsCollection = window.updateGoodsCollection;
      var goods = window.goodsData;
      var favoriteList = window.favoriteList

      filteredGoods = goods;

      for (var i = 0; i < activeFilters.length; i++) {
        filteredGoods = activeFilters[i](evt, filteredGoods);
      }

      if (evt.target === favoriteInput) {
        if (favoriteList) {
          filteredGoods = favoriteList;
        } else {
          filteredGoods = [];
        }
        findPriceValue(goods);
      };


      if (evt.target === availabilityInput) {
        filteredGoods = goods.filter(function(item) {
          return item.amount > 0;
        });
      };

      if (evt.target === filterSubmitButton) {
        console.log("клик по показать все");
        evt.preventDefault();
        filteredGoods = goods;
      };

      console.log("конечные данные");
      console.log(filteredGoods);

      updateGoodsCollection(filteredGoods);
    }
  });

  window.findGoodsNumber = findGoodsNumber;
})();
