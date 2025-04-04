const fzDefault = 16;
const vpDefault = 1920;

const getScheme = (schemeList) => {

  const screenWidth = window.screen.width;

  schemeList.forEach((scheme) => {
    const color = scheme.getAttribute('data-color');
    const dataSet1 = scheme.getAttribute('data-set1') / fzDefault;
    const dataSet2 = scheme.getAttribute('data-set2') / fzDefault;

    const set1 = dataSet1 / vpDefault * screenWidth;
    const set2 = dataSet2 / vpDefault * screenWidth;

    scheme.style.setProperty('--color', color);
    scheme.style.setProperty('--set1', `${set1}rem`);
    scheme.style.setProperty('--set2', `${set2}rem`);

    scheme.removeAttribute('data-color');
    scheme.removeAttribute('data-set1');
    scheme.removeAttribute('data-set2');
  });
};

export {getScheme};
