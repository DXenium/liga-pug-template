import { getCardColor } from '../../utils/card-color';

function initDirectionsSwiper() {
  if (window.innerWidth < 768) {
    const initSwiper = () => {
      const swiper = new Swiper('[data-directions-swiper]', {
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
            const slides = document.querySelectorAll('.directions__card');
            getCardColor(slides);
          },
          slideChangeTransitionEnd: function() {
            const slides = document.querySelectorAll('.directions__card');
            getCardColor(slides);
          }
        }
      });

      return swiper;
    };

    let swiperInstance = initSwiper();

    // Инициализация цветов при первой загрузке
    const initialSlides = document.querySelectorAll('.directions__card');
    getCardColor(initialSlides);

    window.addEventListener('resize', function() {
      if (window.innerWidth >= 768 && swiperInstance && swiperInstance.initialized) {
        swiperInstance.destroy(true, true);
      } else if (window.innerWidth < 768 && (!swiperInstance || !swiperInstance.initialized)) {
        swiperInstance = initSwiper();
        const slides = document.querySelectorAll('.directions__card');
        getCardColor(slides);
      }
    });
  }
}

export { initDirectionsSwiper };
