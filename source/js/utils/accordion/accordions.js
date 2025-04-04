export class Accordions {
  constructor() {
    this._openHeight = 0;
    this._windowWidth = window.innerWidth;
    this._closeTimeout = null;
    this._isMobile = window.matchMedia('(max-width: 1023px)').matches;
    this._accordionStates = new WeakMap();

    // Bind handlers
    this._documentClickHandler = this._documentClickHandler.bind(this);
    this._windowResizeHandler = this._windowResizeHandler.bind(this);
    this._buttonMouseEnterHandler = this._buttonMouseEnterHandler.bind(this);
    this._buttonMouseLeaveHandler = this._buttonMouseLeaveHandler.bind(this);
    this._contentMouseEnterHandler = this._contentMouseEnterHandler.bind(this);
    this._contentMouseLeaveHandler = this._contentMouseLeaveHandler.bind(this);
    this._documentKeydownHandler = this._documentKeydownHandler.bind(this);
    this._buttonClickHandler = this._buttonClickHandler.bind(this);

    this._init();
  }

  _init() {
    this.fullUpdate();

    document.addEventListener('click', this._documentClickHandler);
    window.addEventListener('resize', this._windowResizeHandler);
    document.addEventListener('keydown', this._documentKeydownHandler);

    const buttons = document.querySelectorAll('[data-accordion="button"]');
    buttons.forEach(button => {
      button.addEventListener('click', this._buttonClickHandler);

      if (!this._isMobile) {
        button.addEventListener('mouseenter', this._buttonMouseEnterHandler);
        button.addEventListener('mouseleave', this._buttonMouseLeaveHandler);
      }
    });

    const contents = document.querySelectorAll('[data-accordion="content"]');
    contents.forEach(content => {
      if (!this._isMobile) {
        content.addEventListener('mouseenter', this._contentMouseEnterHandler);
        content.addEventListener('mouseleave', this._contentMouseLeaveHandler);
      }
    });
  }

  _getState(element) {
    if (!this._accordionStates.has(element)) {
      this._accordionStates.set(element, {
        openedByHover: false,
        openedByClick: false,
        hoverLock: false
      });
    }
    return this._accordionStates.get(element);
  }

  _buttonMouseEnterHandler(evt) {
    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout);
      this._closeTimeout = null;
    }

    const button = evt.target;
    const element = button.closest('[data-accordion="element"]');
    const state = this._getState(element);

    if (!state.openedByClick && !element.classList.contains('is-active')) {
      state.openedByHover = true;
      state.hoverLock = true;
      this.openAccordion(element, true, 'hover');
    }
  }

  _buttonMouseLeaveHandler(evt) {
    const button = evt.target;
    const element = button.closest('[data-accordion="element"]');
    const state = this._getState(element);

    if (state.openedByHover && !state.hoverLock) {
      this._scheduleClose(element);
    }
    state.hoverLock = false;
  }

  _contentMouseEnterHandler(evt) {
    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout);
      this._closeTimeout = null;
    }

    const content = evt.target;
    const element = content.closest('[data-accordion="element"]');
    const state = this._getState(element);
    state.hoverLock = true;
  }

  _contentMouseLeaveHandler(evt) {
    const content = evt.target;
    const element = content.closest('[data-accordion="element"]');
    const state = this._getState(element);

    if (state.openedByHover) {
      state.hoverLock = false;
      this._scheduleClose(element);
    }
  }

  _scheduleClose(element) {
    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout);
    }

    this._closeTimeout = setTimeout(() => {
      const state = this._getState(element);
      if (state.openedByHover && !state.hoverLock && element.classList.contains('is-active')) {
        this.closeAccordion(element);
        state.openedByHover = false;
      }
    }, 300);
  }

  _buttonClickHandler(evt) {
    evt.preventDefault();
    const button = evt.target;
    const element = button.closest('[data-accordion="element"]');
    const parent = element.closest('[data-accordion="parent"]');
    const state = this._getState(element);

    if (parent.dataset.destroy && !window.matchMedia(parent.dataset.destroy).matches) {
      return;
    }

    // Сбрасываем hover-состояние при клике
    state.openedByHover = false;
    state.hoverLock = false;

    if (element.classList.contains('is-active')) {
      this.closeAccordion(element);
      state.openedByClick = false;
    } else {
      state.openedByClick = true;
      this.openAccordion(element, true, 'click');
    }
  }

  _documentClickHandler(evt) {
    const target = evt.target;

    if (target.closest('[data-accordion="button"]') ||
        target.closest('[data-accordion="content"]')) {
      return;
    }

    this.closeAllAccordions();
  }

  _documentKeydownHandler(evt) {
    if (evt.key === 'Escape') {
      this.closeAllAccordions();
    }
  }

  _windowResizeHandler() {
    if (this._windowWidth === window.innerWidth) {
      return;
    }

    this._windowWidth = window.innerWidth;
    const newIsMobile = window.matchMedia('(max-width: 1023px)').matches;

    if (newIsMobile !== this._isMobile) {
      this._isMobile = newIsMobile;
      this._reinitEventListeners();
    }

    this.updateAccordionsHeight();
  }

  _reinitEventListeners() {
    const buttons = document.querySelectorAll('[data-accordion="button"]');
    const contents = document.querySelectorAll('[data-accordion="content"]');

    buttons.forEach(button => {
      button.removeEventListener('mouseenter', this._buttonMouseEnterHandler);
      button.removeEventListener('mouseleave', this._buttonMouseLeaveHandler);

      if (!this._isMobile) {
        button.addEventListener('mouseenter', this._buttonMouseEnterHandler);
        button.addEventListener('mouseleave', this._buttonMouseLeaveHandler);
      }
    });

    contents.forEach(content => {
      content.removeEventListener('mouseenter', this._contentMouseEnterHandler);
      content.removeEventListener('mouseleave', this._contentMouseLeaveHandler);

      if (!this._isMobile) {
        content.addEventListener('mouseenter', this._contentMouseEnterHandler);
        content.addEventListener('mouseleave', this._contentMouseLeaveHandler);
      }
    });
  }

  closeAllAccordions() {
    const openElements = document.querySelectorAll('[data-accordion="element"].is-active');
    openElements.forEach(element => {
      const state = this._getState(element);
      state.openedByClick = false;
      state.openedByHover = false;
      this.closeAccordion(element);
    });
  }

  closeAllAccordion(parent) {
    const elements = parent.querySelectorAll('[data-accordion="element"]');
    elements.forEach((element) => {
      const currentParent = element.closest('[data-accordion="parent"]');
      if (currentParent === parent) {
        const state = this._getState(element);
        state.openedByClick = false;
        state.openedByHover = false;
        this.closeAccordion(element);
      }
    });
  }

  updateAccordionsHeight(element = null) {
    if (element) {
      const content = element.querySelector('[data-accordion="content"]');
      content.style.transition = 'none';
      content.style.maxHeight = `${content.scrollHeight}px`;
      setTimeout(() => {
        content.style.transition = null;
      });
      return;
    }

    const closeElements = document.querySelectorAll('[data-accordion="element"]:not(.is-active)');
    closeElements.forEach((closeElement) => {
      const parent = closeElement.closest('[data-accordion="parent"]');
      const content = closeElement.querySelector('[data-accordion="content"]');
      if (parent.dataset.destroy && !window.matchMedia(parent.dataset.destroy).matches) {
        content.style.maxHeight = '100%';
        return;
      }
      content.style.maxHeight = null;
    });

    const openElements = document.querySelectorAll('[data-accordion="element"].is-active');
    openElements.forEach((openElement) => {
      const content = openElement.querySelector('[data-accordion="content"]');
      const parent = openElement.closest('[data-accordion="parent"]');
      if (parent.dataset.destroy && !window.matchMedia(parent.dataset.destroy).matches) {
        content.style.maxHeight = '100%';
        return;
      }
      content.style.transition = 'none';
      content.style.maxHeight = `${content.scrollHeight}px`;
      setTimeout(() => {
        content.style.transition = null;
      });
    });
  }

  fullUpdate(parent = null, transition = false) {
    let openElements;
    if (parent) {
      openElements = parent.querySelectorAll('[data-accordion="element"].is-active');
    } else {
      openElements = document.querySelectorAll('[data-accordion="element"].is-active');
    }
    openElements.forEach((openElement) => {
      const innerParent = openElement.querySelector('[data-accordion="parent"]');
      if (innerParent) {
        return;
      }
      this.openAccordion(openElement, transition);
    });
    this.updateAccordionsHeight();
  }

  openAccordion(element, transition = true, triggerType = null) {
    const parentElement = element.closest('[data-accordion="parent"]');
    const contentElement = element.querySelector('[data-accordion="content"]');
    const state = this._getState(element);

    this._openHeight += contentElement.scrollHeight;

    if (parentElement.hasAttribute('data-single')) {
      this.closeAllAccordion(parentElement);
    }

    element.classList.add('is-active');
    const button = element.querySelector('[data-accordion="button"]');
    button.setAttribute('aria-expanded', 'true');

    if (transition) {
      contentElement.style.maxHeight = `${this._openHeight}px`;
    } else {
      contentElement.style.transition = 'none';
      contentElement.style.maxHeight = `${this._openHeight}px`;
      setTimeout(() => {
        contentElement.style.transition = null;
      });
    }

    if (triggerType === 'hover') {
      state.openedByHover = true;
      state.openedByClick = false;
    } else if (triggerType === 'click') {
      state.openedByClick = true;
      state.openedByHover = false;
    }

    if (parentElement.closest('[data-accordion="element"]')) {
      this.openAccordion(parentElement.closest('[data-accordion="element"]'), transition, triggerType);
      return;
    }

    this._openHeight = 0;
  }

  closeAccordion(element, transition = true) {
    const contentElement = element.querySelector('[data-accordion="content"]');
    if (!contentElement) {
      return;
    }

    const state = this._getState(element);
    element.classList.remove('is-active');
    const button = element.querySelector('[data-accordion="button"]');
    button.setAttribute('aria-expanded', 'false');

    if (transition) {
      contentElement.style.maxHeight = '0';
    } else {
      contentElement.style.transition = 'none';
      contentElement.style.maxHeight = '0';
      setTimeout(() => {
        contentElement.style.transition = null;
      });
    }
  }
}
