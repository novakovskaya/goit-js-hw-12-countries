import debounce from 'lodash.debounce';
import { error } from '@pnotify/core';
import { defaults } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

import { fetchCountries } from './fetchCountries';
import refs from './refs';
import countriesCardMarkup from '../templates/countriesCard.hbs';
import countriesListMarkup from '../templates/countriesList.hbs';
defaults.delay = 2000;

refs.input.addEventListener('input', debounce(onInputSearch, 500));

function onInputSearch(event) {
  const inputValue = event.target.value.trim();
  let message = 'Requested country not found!';

  if (inputValue === '') {
    clearContainer();
    return;
  }

  fetchCountries(inputValue)
    .then(countries => {
      if (countries.status === 404) {
        showNotification(message);
        clearContainer();
      } else if (countries.length > 10) {
        message = 'Too many matches found. Please enter a more specific query!';
        showNotification(message);
        clearContainer();
      } else if (countries.length >= 2 && countries.length <= 10) {
        createCountriesMarkup(countries, countriesListMarkup);
      } else if (countries.length === 1) {
        createCountriesMarkup(...countries, countriesCardMarkup);
      }
    })
    .catch(error => onError(message));
}

function showNotification(message) {
  error({
    text: `${message}`,
  });
}

function createCountriesMarkup(countries, template) {
  refs.countriesContainer.innerHTML = template(countries);
}

function clearContainer() {
  refs.countriesContainer.innerHTML = '';
}
