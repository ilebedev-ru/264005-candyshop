'use strict';

(function () {
  var paymentValidateParam = window.utils.paymentValidateParam;
  var checkNumberByLun = window.utils.checkNumberByLun;

  var payment = document.querySelector('.payment');
  var paymentCard = payment.querySelector('.payment__card-wrap');
  var paymentCash = payment.querySelector('.payment__cash-wrap');
  var paymentCardInputs = paymentCard.querySelectorAll('input');

  var bankCardSucsessMessadge = payment.querySelector('.payment__card-status');
  var bankCardErrorMessadge = payment.querySelector('.payment__error-message');
  var emailInput = document.querySelector('#contact-data__email');
  var cardNumberInput = payment.querySelector('#payment__card-number');
  var cvcNumberInput = payment.querySelector('#payment__card-cvc');
  var dateInput = payment.querySelector('#payment__card-date');

  var deliver = document.querySelector('.deliver');
  var deliverStore = deliver.querySelector('.deliver__store');
  var deliverCourier = deliver.querySelector('.deliver__courier');
  var deliverСourierInputs = deliver.querySelectorAll('.deliver__address-entry-fields input');
  var deliverStoreInputs = deliver.querySelectorAll('.deliver__store-list input');
  var deliverStoreImg = deliver.querySelector('.deliver__store-map-img');

  // переключение владки оплаты
  var togglePayment = function (type) {
    if (type === 'payment__card') {
      paymentCard.classList.remove('visually-hidden');
      paymentCash.classList.add('visually-hidden');
      for (var i = 0; i < paymentCardInputs.length; i++) {
        paymentCardInputs[i].disabled = false;
      }
    }

    if (type === 'payment__cash') {
      paymentCard.classList.add('visually-hidden');
      paymentCash.classList.remove('visually-hidden');
      for (var j = 0; j < paymentCardInputs.length; j++) {
        paymentCardInputs[j].disabled = true;
      }
    }
  };

  // переключение владки доставки
  var toggleDeliver = function (type) {
    if (type === 'deliver__store') {
      deliverStore.classList.remove('visually-hidden');
      deliverCourier.classList.add('visually-hidden');
      for (var i = 0; i < deliverStoreInputs.length; i++) {
        deliverStoreInputs[i].disabled = false;
      }

      for (var j = 0; j < deliverСourierInputs.length; j++) {
        deliverСourierInputs[j].disabled = true;
      }
    }

    if (type === 'deliver__courier') {
      deliverStore.classList.add('visually-hidden');
      deliverCourier.classList.remove('visually-hidden');
      for (var k = 0; k < deliverStoreInputs.length; k++) {
        deliverStoreInputs[k].disabled = true;
      }

      for (var l = 0; l < deliverСourierInputs.length; l++) {
        deliverСourierInputs[l].disabled = false;
      }
    }
  };

  payment.addEventListener('click', function (evt) {
    togglePayment(evt.target.id);
  });

  deliver.addEventListener('click', function (evt) {
    toggleDeliver(evt.target.id);

    if (evt.target.classList.contains('input-btn__input')) {
      deliverStoreImg.src = 'img/map/' + evt.target.value + '.jpg';
      deliverStoreImg.alt = evt.target.value;
    }
  });

  emailInput.addEventListener('blur', function () {
    if (emailInput.validity.patternMismatch) {
      emailInput.setCustomValidity('Введите E-mail в формате mail@mail.ru');
    } else {
      emailInput.setCustomValidity('');
    }
  });

  cardNumberInput.addEventListener('blur', function () {
    if (cardNumberInput.value.length !== paymentValidateParam.CARD_LENGTH) {
      cardNumberInput.style.borderColor = 'red';
      cardNumberInput.setCustomValidity('Номер карты должен содержать 16 цифр');
    } else {
      if (!checkNumberByLun(cardNumberInput.value)) {
        cardNumberInput.style.borderColor = 'red';
        cardNumberInput.setCustomValidity('Неверный номер карты');
        bankCardErrorMessadge.classList.remove('visually-hidden');
      } else {
        cardNumberInput.style.borderColor = 'green';
        cardNumberInput.setCustomValidity('');
        bankCardSucsessMessadge.textContent = 'Одобрен';
        bankCardErrorMessadge.classList.add('visually-hidden');
      }
    }
  });

  dateInput.addEventListener('blur', function () {
    if (dateInput.validity.patternMismatch) {
      dateInput.setCustomValidity('Введите дату в формате ММ/ГГ');
      dateInput.style.borderColor = 'red';
    } else if (dateInput.value.length === paymentValidateParam.DATE_LENGTH) {
      dateInput.setCustomValidity('');
      dateInput.style.borderColor = 'green';
    }
  });

  cvcNumberInput.addEventListener('blur', function () {
    var cvcNumber = +cvcNumberInput.value;
    if (cvcNumberInput.validity.patternMismatch) {
      cvcNumberInput.setCustomValidity('CVC код должен состоять из цифр');
      cvcNumberInput.style.borderColor = 'red';
    } else if (cvcNumber < paymentValidateParam.CVC_MIN) {
      cvcNumberInput.style.borderColor = 'red';
      cvcNumberInput.setCustomValidity('CVC код должен быть от 100 до 999');
    } else {
      cvcNumberInput.style.borderColor = 'green';
      cvcNumberInput.setCustomValidity('');
    }
  });

  window.orderFormValidate = {
    togglePayment: togglePayment,
    toggleDeliver: toggleDeliver
  };
})();
