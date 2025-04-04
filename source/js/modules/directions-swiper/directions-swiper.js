import {getCardColor} from '../../utils/card-color';

document.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth < 768) {
    const initSwiperDirections = () => {
      const swiperDirections = new Swiper('[data-directions-swiper]', {
        navigation: {
          nextEl: '[data-directions-next]',
          prevEl: '[data-directions-prev]',
        },
        loop: true,
        slidesPerView: 'auto',
        spaceBetween: 9,
        allowTouchMove: true,
        centeredSlides: true,

        on: {
          init: function() {
            // Применяем цвета при инициализации
            const slides = document.querySelectorAll('.directions__card');
            getCardColor(slides);
          },
          slideChangeTransitionEnd: function() {
            // Обновляем цвета после анимации переключения слайдов
            const slides = document.querySelectorAll('.directions__card');
            getCardColor(slides);
          }
        }
      });

      return swiperDirections;
    };

    let swiperDirections;

    if (window.innerWidth < 768) {
      swiperDirections = initSwiperDirections();

      // Инициализация цветов при первой загрузке
      const initialSlides = document.querySelectorAll('.directions__card');
      getCardColor(initialSlides);
    }

    window.addEventListener('resize', function() {
      if (window.innerWidth >= 768 && swiperDirections && swiperDirections.initialized) {
        swiperDirections.destroy(true, true);
      } else if (window.innerWidth < 768 && (!swiperDirections || !swiperDirections.initialized)) {
        swiperDirections = initSwiperDirections();

        // Обновляем цвета при ресайзе на мобильный вид
        const slides = document.querySelectorAll('.directions__card');
        getCardColor(slides);
      }
    });
  }
});
