function initBurgerMenu(config = {}) {
  // Конфигурация с дефолтными значениями
  const SELECTORS = {
    BUTTON: '[data-navigation-toggle]',
    MENU: '[data-navigation-menu]',
    OVERLAY: '[data-navigation-overlay]',
    ACTIVE_CLASS: 'is-open',
    OVERLAY_VISIBLE_CLASS: 'overlay-visible',
    ...config // Позволяет переопределять конфиг
  };

  // Кэшируем элементы
  const burgerButton = document.querySelector(SELECTORS.BUTTON);
  const menu = document.querySelector(SELECTORS.MENU);
  const overlay = document.querySelector(SELECTORS.OVERLAY);

  // Проверяем, что элементы существуют
  if (!burgerButton || !menu || !overlay) {
    console.warn('Burger menu elements not found!');
    return null;
  }

  // Функции управления меню
  function toggleMenu() {
    menu.classList.contains(SELECTORS.ACTIVE_CLASS) ? closeMenu() : openMenu();
  }

  function openMenu() {
    burgerButton.classList.add(SELECTORS.ACTIVE_CLASS);
    burgerButton.setAttribute('aria-expanded', 'true');
    menu.classList.add(SELECTORS.ACTIVE_CLASS);
    menu.setAttribute('aria-hidden', 'false');
    overlay.classList.add(SELECTORS.OVERLAY_VISIBLE_CLASS);
    document.body.style.overflow = 'hidden'; // Блокируем скролл
  }

  function closeMenu() {
    burgerButton.classList.remove(SELECTORS.ACTIVE_CLASS);
    burgerButton.setAttribute('aria-expanded', 'false');
    menu.classList.remove(SELECTORS.ACTIVE_CLASS);
    menu.setAttribute('aria-hidden', 'true');
    overlay.classList.remove(SELECTORS.OVERLAY_VISIBLE_CLASS);
    document.body.style.overflow = ''; // Восстанавливаем скролл
  }

  // Обработчики событий
  function setupEventListeners() {
    burgerButton.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !burgerButton.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains(SELECTORS.ACTIVE_CLASS)) {
        closeMenu();
      }
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768) {
          closeMenu();
        }
      }, 250);
    });
  }

  // Инициализация
  setupEventListeners();

  // Возвращаем методы для внешнего управления
  return {
    open: openMenu,
    close: closeMenu,
    toggle: toggleMenu,
    destroy: () => {
      burgerButton.removeEventListener('click', toggleMenu);
      overlay.removeEventListener('click', closeMenu);
      window.removeEventListener('resize', closeMenu);
      closeMenu(); // Закрываем меню при уничтожении
    }
  };
}

export { initBurgerMenu };
