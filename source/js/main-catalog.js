'use strict';
const catalogList = document.querySelector('.main-catalog__list');
const catalogItems = catalogList.querySelectorAll('.main-catalog__item');
const mediaQueryList = window.matchMedia('(min-width: 1180px)');

const windowWidthPoint = 1180;

const itemClass = 'main-catalog__item';
const prevClass = `${itemClass}--prev`;
const currentClass = `${itemClass}--current`;
const nextClass = `${itemClass}--next`;

let isSet = false;

const resetClasses = () => {
  catalogItems.forEach((item) => item.className = itemClass);
};

const setClasses = () => {
  catalogItems[0].classList.add(prevClass);
  catalogItems[1].classList.add(currentClass);
  catalogItems[2].classList.add(nextClass);
};

const screenSizeChangeHandler = (mql) => {
  if (mql.matches && isSet) {
    resetClasses();
    isSet = false;
  } else if (!mql.matches && !isSet) {
    setClasses();
    isSet = true;
  }
};

if (document.documentElement.clientWidth < windowWidthPoint) {
  setClasses();
  isSet = true;
}

screenSizeChangeHandler(mediaQueryList);

mediaQueryList.addEventListener("change", screenSizeChangeHandler);
