new Swiper('.hero__slider', {
  slidesPerView: 2,
  spaceBetween: 10,
  loop: true,
  navigation: {
    prevEl: '.hero__slider-btn_prev',
    nextEl: '.hero__slider-btn_next',
  },
  autoplay: {
    delay: 3000,
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    560: {
      spaceBetween: 8,
    },
  },
});

const calcForm = document.querySelector('.js-calc-form');
const totalSquare = document.querySelector('.js-square');
const totalPrice = document.querySelector('.js-total-price');
const calcResultWrapper = document.querySelector('.calc__result-wrapper');
const btnSubmit = document.querySelector('.js-submit');
const calcOrder = document.querySelector('.calc__order');

const tariff = {
  economy: 600,
  comfort: 1200,
  premium: 1800,
};

calcForm.addEventListener('input', () => {
  btnSubmit.disabled = !(calcForm.width.value > 0 && calcForm.length.value > 0);
});

calcForm.addEventListener('submit', e => {
  e.preventDefault();

  if (calcForm.width.value > 0 && calcForm.length.value > 0) {
    const square = calcForm.width.value * calcForm.length.value;
    const price = square * tariff[calcForm.tariff.value];
    calcResultWrapper.classList.add('calc__result-wrapper_show');
    calcOrder.classList.add('calc__order_show')

    totalSquare.textContent = `${square} кв м`;
    totalPrice.textContent = `${price} руб`;
  }
});

const scrollController = {
  scrollPosition: 0,
  disabledScroll() {
    scrollController.scrollPosition = window.scrollY;
    document.body.style.cssText = `
      overflow: hidden;
      position: fixed;
      top: -${scrollController.scrollPosition}px;
      left: 0;
      height: 100vh;
      width: 100vw;
      padding-right: ${window.innerWidth - document.body.offsetWidth}px;
    `;
    document.documentElement.style.scrollBehavior = 'unset';
  },
  enabledScroll() {
    document.body.style.cssText = 'position: relative;';
    window.scroll({ top: scrollController.scrollPosition });
    document.documentElement.style.scrollBehavior = '';
  },
};

const modalContoller = ({ modal, btnOpen, btnClose, time }) => {
  const buttonElem = document.querySelectorAll(btnOpen);
  const modalElem = document.querySelector(modal);

  modalElem.style.cssText = `
    display: flex;
    visibility: hidden;
    opacity: 0;
    transition: opacity ${time}ms ease-in-out; 
  `;

  const closeModal = event => {
    const target = event.target;
    if (
      target === modalElem ||
      (btnClose && target.closest(btnClose)) ||
      event.code === 'Escape'
    ) {
      modalElem.style.opacity = 0;

      setTimeout(() => {
        modalElem.style.visibility = 'hidden';
        scrollController.enabledScroll();
      }, 0);
      window.removeEventListener('keydown', closeModal);
    }
  };

  const openModal = () => {
    modalElem.style.visibility = 'visible';
    modalElem.style.opacity = 1;
    window.addEventListener('keydown', closeModal);
    scrollController.disabledScroll();
  };

  buttonElem.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  modalElem.addEventListener('click', closeModal);
};

modalContoller({
  modal: '.modal',
  btnOpen: '.js-order',
  btnClose: '.modal__close',
  time: 500,
});

const phone = document.getElementById('phone');
const imPhone = new Inputmask('+375(99)999-99-99');
imPhone.mask(phone);

const validator = new JustValidate('.modal__form', {
  errorLabelCssClass: 'modal__input-error',
  errorLabelStyle: {
    color: '#FFC700',
  },
});

validator
  .addField('#name', [
    {
      rule: 'required',
      errorMessage: 'Как вас зовут?',
    },
    {
      rule: 'minLength',
      value: 3,
      errorMessage: 'Не короче 3-х символов',
    },
    {
      rule: 'maxLength',
      value: 20,
      errorMessage: 'Слишком длинное имя',
    },
  ])
  .addField('#phone', [
    {
      rule: 'required',
      errorMessage: 'Укажите ваш телефон',
    },
    {
      validator: value => {
        const number = phone.inputmask.unmaskedvalue();
        return number.length === 9;
      },
      errorMessage: 'Телефон не корректный',
    },
  ]);
validator.onSuccess(event => {
  const form = event.currentTarget;
  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify({
      name: form.name.value,
      phone: form.phone.value,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then(response => response.json())
    .then(data => {
      form.reset();
      alert(`Спасибо, мы вам перезвоним, ваша заявка под номером: ${data.id}`);
    });
});
