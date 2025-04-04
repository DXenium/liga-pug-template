function initPromoSwiper() {
  let swiperPromo = null;
  const promoSection = document.querySelector('.promo');

  if (!promoSection) return;

  const initSwiper = () => {
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
          loopAdditionalSlides: 1,
          loopedSlides: 3,
          slidesPerView: 'auto',
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
          observer: true,
          observeParents: true,
          observeSlideChildren: true,
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

  // Инициализация при загрузке
  initSwiper();

  // Оптимизация ресайза
  let resizeTimeout;
  const resizeHandler = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initSwiper, 250);
  };

  window.addEventListener('resize', resizeHandler);

  // Очистка
  return () => {
    window.removeEventListener('resize', resizeHandler);
    if (swiperPromo) {
      swiperPromo.destroy(true, true);
    }
  };
}

export { initPromoSwiper };
