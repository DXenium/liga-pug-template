document.addEventListener('DOMContentLoaded', () => {
  let swiperPromo = null;
  let promoSection = document.querySelector('.promo');

  const initSwiper = () => {
    if (!promoSection) return;

    const promoWrapper = promoSection.querySelector('[data-promo-swiper]');
    const tabParent = promoSection.querySelector('[data-tabs="parent"]');

    if (window.innerWidth < 768) {
      // Отключаем табы только для промо-секции
      if (window.tabs && tabParent) {
        document.removeEventListener('click', window.tabs._documentClickHandler);
      }

      // Удаляем атрибуты data-tabs только в промо-секции
      const tabElements = promoSection.querySelectorAll('[data-tabs]');
      tabElements.forEach(el => el.removeAttribute('data-tabs'));

      if (!swiperPromo && promoWrapper) {
        swiperPromo = new Swiper(promoWrapper, {
          navigation: {
            nextEl: promoSection.querySelector('[data-promo-next]'),
            prevEl: promoSection.querySelector('[data-promo-prev]'),
          },
          loop: true,
          loopAdditionalSlides: 1, // Добавляем дополнительные слайды для плавности
          loopedSlides: 3, // Указываем количество дублируемых слайдов
          slidesPerView: 1,
          watchOverflow: true,
          spaceBetween: 9,
          allowTouchMove: true,
          centeredSlides: true,
          touchRatio: 0.8,
          slideToClickedSlide: true,
          a11y: {
            prevSlideMessage: 'Previous slide',
            nextSlideMessage: 'Next slide',
          },
          // Важные настройки для работы навигации в loop-режиме
          observer: true,
          observeParents: true,
          observeSlideChildren: true,
          // Отключаем перетаскивание на навигационных кнопках
          // preventClicks: false,
          // preventClicksPropagation: false,
        });

        // Дополнительная проверка для кнопок навигации
        const nextBtn = promoSection.querySelector('[data-promo-next]');
        const prevBtn = promoSection.querySelector('[data-promo-prev]');

        if (nextBtn && prevBtn) {
          nextBtn.addEventListener('click', (e) => e.preventDefault());
          prevBtn.addEventListener('click', (e) => e.preventDefault());
        }
      }
    } else {
      if (swiperPromo) {
        swiperPromo.destroy(true, true);
        swiperPromo = null;

        // Восстанавливаем табы при возвращении на десктоп
        if (!window.tabs) {
          initTabs();
        } else if (tabParent) {
          window.tabs._initTab(tabParent);
        }
      }
    }
  };

  // Инициализация
  if (promoSection) {
    initSwiper();

    let resizeTimeout;
    const resizeHandler = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        initSwiper();
      }, 250);
    };

    window.addEventListener('resize', resizeHandler);

    // Очистка при уничтожении
    window.addEventListener('beforeunload', () => {
      window.removeEventListener('resize', resizeHandler);
      if (swiperPromo) {
        swiperPromo.destroy(true, true);
      }
    });
  }
});
