// Конфигурация (селекторы и классы)
const SELECTORS = {
  BUTTON: '[data-navigation-toggle]',
  MENU: '[data-navigation-menu]',
  OVERLAY: '[data-navigation-overlay]', // Новый элемент для затемнения
  ACTIVE_CLASS: 'is-open',
  OVERLAY_VISIBLE_CLASS: 'overlay-visible' // Класс для затемнения
};

// Кэшируем элементы
const burgerButton = document.querySelector(SELECTORS.BUTTON);
const menu = document.querySelector(SELECTORS.MENU);
const overlay = document.querySelector(SELECTORS.OVERLAY); // Получаем элемент затемнения

// Проверяем, что элементы существуют
if (burgerButton && menu && overlay) {
  // Добавляем обработчик клика на бургер
  burgerButton.addEventListener('click', toggleMenu);

  // Закрываем меню при клике на оверлей
  overlay.addEventListener('click', closeMenu);

  // Закрываем меню при клике вне области
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !burgerButton.contains(e.target)) {
      closeMenu();
    }
  });

  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains(SELECTORS.ACTIVE_CLASS)) {
      closeMenu();
    }
  });
}

function toggleMenu() {
  if (menu.classList.contains(SELECTORS.ACTIVE_CLASS)) {
    closeMenu();
  } else {
    openMenu();
  }
}

function openMenu() {
  burgerButton.classList.add(SELECTORS.ACTIVE_CLASS);
  burgerButton.setAttribute('aria-expanded', 'true');
  menu.classList.add(SELECTORS.ACTIVE_CLASS);
  menu.setAttribute('aria-hidden', 'false');
  overlay.classList.add(SELECTORS.OVERLAY_VISIBLE_CLASS); // Показываем оверлей
}

function closeMenu() {
  burgerButton.classList.remove(SELECTORS.ACTIVE_CLASS);
  burgerButton.setAttribute('aria-expanded', 'false');
  menu.classList.remove(SELECTORS.ACTIVE_CLASS);
  menu.setAttribute('aria-hidden', 'true');
  overlay.classList.remove(SELECTORS.OVERLAY_VISIBLE_CLASS); // Скрываем оверлей
}

// Обработчик ресайза (автозакрытие на десктопе)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  }, 250);
});
