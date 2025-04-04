const getCardColor = (colorList) => {

  colorList.forEach((i) => {
    const color = i.getAttribute('data-color');
    i.style.setProperty('--color', color);
    // i.removeAttribute('data-color');
  });
};

export {getCardColor};
