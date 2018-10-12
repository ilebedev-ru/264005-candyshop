'use strict';

(function () {
  var ESC_KEYCODE = window.utils.ESC_KEYCODE;
  var paymentValidateParam = window.utils.paymentValidateParam;
  var checkNumberByLun = window.utils.checkNumberByLun;

  var form = document.querySelector('.buy form');
  var modalSuccess = document.querySelector('.modal--success');
  var modalError = document.querySelector('.modal--error');
  var errorCloseBtn = modalError.querySelector('.modal__close');
  var successCloseBtn = modalSuccess.querySelector('.modal__close');

  var payment = document.querySelector('.payment');
  var paymentCard = payment.querySelector('.payment__card-wrap');
  var paymentCash = payment.querySelector('.payment__cash-wrap');
  var paymentCardInputs = paymentCard.querySelectorAll('input');

  var bankCardSuccessMessage = payment.querySelector('.payment__card-status');
  var bankCardErrorMessage = payment.querySelector('.payment__error-message');
  var emailInput = document.querySelector('#contact-data__email');
  var cardNumberInput = payment.querySelector('#payment__card-number');
  var cvcNumberInput = payment.querySelector('#payment__card-cvc');
  var dateInput = payment.querySelector('#payment__card-date');

  var deliver = document.querySelector('.deliver');
  var deliverStore = deliver.querySelector('.deliver__store');
  var deliverCourier = deliver.querySelector('.deliver__courier');
  var deliverCourierInputs = deliver.querySelectorAll('.deliver__address-entry-fields input');
  var deliverStoreInputs = deliver.querySelectorAll('.deliver__store-list input');
  var deliverStoreImg = deliver.querySelector('.deliver__store-map-img');

  var clickErrCloseBtnHandler = function () {
    modalError.classList.add('modal--hidden');
  };

  var keydownEscErrModalHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      clickErrCloseBtnHandler();
      document.removeEventListener('keydown', keydownEscErrModalHandler);
    }
  };

  var clickSuccCloseBtnHandler = function () {
    modalSuccess.classList.add('modal--hidden');
  };

  var keydownEscSuccModalHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      clickSuccCloseBtnHandler();
      document.removeEventListener('keydown', keydownEscSuccModalHandler);
    }
  };

  var switchInputs = function (inputs, bool) {
    Array.prototype.forEach.call(inputs, function (input) {
      input.disabled = bool;
    });
  };

  // переключение владки оплаты
  var togglePayment = function (type) {
    if (type === 'payment__card') {
      paymentCard.classList.remove('visually-hidden');
      paymentCash.classList.add('visually-hidden');

      switchInputs(paymentCardInputs, false);
    }

    if (type === 'payment__cash') {
      paymentCard.classList.add('visually-hidden');
      paymentCash.classList.remove('visually-hidden');

      switchInputs(paymentCardInputs, true);
    }
  };

  // переключение владки доставки
  var toggleDeliver = function (type) {
    if (type === 'deliver__store') {
      deliverStore.classList.remove('visually-hidden');
      deliverCourier.classList.add('visually-hidden');

      switchInputs(deliverStoreInputs, false);
      switchInputs(deliverCourierInputs, true);
    }

    if (type === 'deliver__courier') {
      deliverStore.classList.add('visually-hidden');
      deliverCourier.classList.remove('visually-hidden');

      switchInputs(deliverStoreInputs, true);
      switchInputs(deliverCourierInputs, false);
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
        bankCardErrorMessage.classList.remove('visually-hidden');
      } else {
        cardNumberInput.style.borderColor = 'green';
        cardNumberInput.setCustomValidity('');
        bankCardSuccessMessage.textContent = 'Одобрен';
        bankCardErrorMessage.classList.add('visually-hidden');
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

  var showSuccessModal = function () {
    modalSuccess.classList.remove('modal--hidden');
    form.reset();
    window.cards.clearCard();

    successCloseBtn.addEventListener('click', clickSuccCloseBtnHandler);
    document.addEventListener('keydown', keydownEscSuccModalHandler);
  };

  var showError = function (errorMessage) {
    modalError.classList.remove('modal--hidden');
    modalError.querySelector('.modal__message').textContent = errorMessage;

    errorCloseBtn.addEventListener('click', clickErrCloseBtnHandler);
    document.addEventListener('keydown', keydownEscErrModalHandler);
  };

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();

    window.backend.save(new FormData(form), showSuccessModal, showError);
  });

  window.orderFormValidate = {
    togglePayment: togglePayment,
    toggleDeliver: toggleDeliver
  };
})();
