'use strict';
const body = document.querySelector('body');
const headerMain = document.querySelector('.header-main');
const userMenu = headerMain.querySelector('.user-menu');
const searchContainer = userMenu.querySelector('.user-menu__search');
const searchWindow = searchContainer.querySelector('.user-menu__search-box');
const searchResults = searchContainer.querySelector('.search-box__list');
const searchButton = searchContainer.querySelector('.user-menu__search-label');
const searchInput = searchWindow.querySelector('.search-box__input');
const searchButtonClose = searchWindow.querySelector('.search-box__button-close');

const KEYCODE_ESC = 27;

const mainPageClass = 'page-main';
const headerTransparencyClass = 'header-main--transparent';
const searchContainerActiveClass = 'user-menu__item--current'
const searchWindowOpenClass = 'user-menu__search-box--open';
const searchResultsOpenClass = 'search-box__list--open';

const isMainPage = body.classList.contains(mainPageClass);

if (isMainPage) {
  headerMain.classList.add(headerTransparencyClass);
}

const searchInputHandler = (evt) => {
  if (evt.target.value.length > 0 && !searchResults.classList.contains(searchResultsOpenClass)) {
    searchResults.classList.add(searchResultsOpenClass);
  } else if (evt.target.value.length === 0) {
    searchResults.classList.remove(searchResultsOpenClass);
  }
};

const closeSearch = () => {
  isMainPage ? headerMain.classList.add(headerTransparencyClass) : '';
  searchContainer.classList.remove(searchContainerActiveClass);
  searchWindow.classList.remove(searchWindowOpenClass);

  searchInput.value = '';

  searchResults.classList.remove(searchResultsOpenClass)
  searchInput.removeEventListener('input', searchInputHandler);
  searchButtonClose.removeEventListener('click', searchCloseClickHandler);
  document.removeEventListener('keydown', searchCloseKeyHandler);
};

const searchCloseClickHandler = (evt) => {
  evt.preventDefault();

  closeSearch();
};

const searchCloseKeyHandler = (evt) => {
  if (evt.keyCode === KEYCODE_ESC) {
    closeSearch();
  }
};

const searchOpenHandler = (evt) => {
  evt.preventDefault();

  isMainPage ? headerMain.classList.remove(headerTransparencyClass) : '';
  searchContainer.classList.add(searchContainerActiveClass);
  searchWindow.classList.add(searchWindowOpenClass);

  searchInput.addEventListener('input', searchInputHandler);
  searchButtonClose.addEventListener('click', searchCloseClickHandler);
  document.addEventListener('keydown', searchCloseKeyHandler);
};

searchButton.addEventListener('click', searchOpenHandler);
