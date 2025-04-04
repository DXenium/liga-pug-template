import {mobileVhFix} from './utils/mobile-vh-fix.js';
import {uploadFile, uploadImageDrop} from './modules/input-file/init-upload';
import {getCardColor} from './utils/card-color';
import {getScheme} from './utils/scheme.js';
import {initTabs} from './utils/tabs/init-tabs.js';
import {initAccordions} from './utils/accordion/init-accordion.js';
import {initDirectionsSwiper} from './modules/directions-swiper/directions-swiper.js';
import { initPromoSwiper } from './modules/promo-swiper/promo-swiper.js';
import {initBurgerMenu} from './utils/burger.js';

const colorList = document.querySelectorAll('.directions__card');
const schemeList = document.querySelectorAll('.compare__scheme');

// ---------------------------------

window.addEventListener('DOMContentLoaded', () => {

  // Utils
  // ---------------------------------
  initBurgerMenu();
  initTabs();
  initAccordions();
  mobileVhFix();
  getCardColor(colorList);
  getScheme(schemeList);

  // Modules
  // ---------------------------------

  // все скрипты должны быть в обработчике 'DOMContentLoaded', но не все в 'load'
  // в load следует добавить скрипты, не участвующие в работе первого экрана
  window.addEventListener('load', () => {
    uploadFile();
    uploadImageDrop();
    initDirectionsSwiper();
    initPromoSwiper();
  });
});

// ---------------------------------

// ❗❗❗ обязательно установите плагины eslint, stylelint, editorconfig в редактор кода.

// привязывайте js не на классы, а на дата атрибуты (data-validate)

// вместо модификаторов .block--active используем утилитарные классы
// .is-active || .is-open || .is-invalid и прочие (обязателен нейминг в два слова)
// .select.select--opened ❌ ---> [data-select].is-open ✅

// выносим все в дата атрибуты
// url до иконок пинов карты, настройки автопрокрутки слайдера, url к json и т.д.

// для адаптивного JS используейтся matchMedia и addListener
// const breakpoint = window.matchMedia(`(min-width:1024px)`);
// const breakpointChecker = () => {
//   if (breakpoint.matches) {
//   } else {
//   }
// };
// breakpoint.addListener(breakpointChecker);
// breakpointChecker();

// используйте .closest(el)
