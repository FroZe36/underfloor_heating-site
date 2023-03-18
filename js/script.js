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

const tariff = {
  economy: 600,
  comfort: 1200,
  premium: 1800,
};

calcForm.addEventListener('submit', e => {
  e.preventDefault();

  if (calcForm.width.value > 0 && calcForm.length.value > 0) {
    const square = calcForm.width.value * calcForm.length.value;
    const price = square * tariff[calcForm.tariff.value];
    calcResultWrapper.style.display = 'block';

    totalSquare.textContent = `${square} кв м`;
    totalPrice.textContent = `${price} руб`;
  }
});
