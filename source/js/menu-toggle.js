'use strict';
const header = document.querySelector('.header-main');
const burgerButton = header.querySelector('.burger-button');

const burgerButtonCloseClass = 'burger-button--close';
const headerOpenClass = 'header-main--open';

const menuToggleHandler = (evt) => {
  evt.preventDefault();

  burgerButton.classList.toggle(burgerButtonCloseClass);
  header.classList.toggle(headerOpenClass);
};

burgerButton.addEventListener('click', menuToggleHandler);
