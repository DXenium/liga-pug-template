document.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth < 768) {
    const initSwiperCool = () => {
      const swiperCool = new Swiper('[data-cool-swiper]', {
        navigation: {
          nextEl: '[data-cool-next]',
          prevEl: '[data-cool-prev]',
        },
        loop: true,
        slidesPerView: 'auto',
        spaceBetween: 9,
        allowTouchMove: true,
        centeredSlides: true,
      });
      return swiperCool;
    };

    let swiperCool;

    if (window.innerWidth < 768) {
      swiperCool = initSwiperCool();
    }

    window.addEventListener('resize', function() {
      if (window.innerWidth >= 768 && swiperCool && swiperCool.initialized) {
        swiperCool.destroy(true, true);
      } else if (window.innerWidth < 768 && (!swiperCool || !swiperCool.initialized)) {
        swiperCool = initSwiperCool();
      }
    });
  }
});
