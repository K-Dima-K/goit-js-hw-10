import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const refs = {
  inputSearch: document.querySelector('#search-box'),
  countriesListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

function onInputChange(e) {
  const valueInput = e.target.value.trim();
  clearInput();

  if (!valueInput) {
    return;
  }

  fetchCountries(valueInput)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        return Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (data.length >= 2 && data.length <= 10) {
        const markup = cuntriesRender(data);
        refs.countriesListEl.insertAdjacentHTML('beforeend', markup);
        return;
      }
      if (data.length === 1) {
        const markup = oneCuntryRender(data);
        refs.countryInfoEl.insertAdjacentHTML('beforeend', markup);
        return;
      }
    })
    .catch(error => {
      clearInput();
      Notiflix.Notify.failure('Oops, there is no country with that name');
      console.log(error);
    });
}

function oneCuntryRender(countries = []) {
  return countries
    .map(
      country =>
        `
        <div class="country-info__box">
      <img class="country-info__image" src="${country.flags.svg}"
     alt="flag" width='40' hight='30'>
     <h1 class="country-info__name">${country.name.official}</h1>
     </div>
     <ul class="country-list">
     <li class="country-list__item">
     <p class="country-list__text">Capital: </p>
     <span class="country-list__span">${country.capital}</span>
     </li>
     <li class="country-list__item">
     <p class="country-list__text">Population: </p>
     <span class="country-list__span">${country.population}</span>
     </li>
     <li class="country-list__item">
     <p class="country-list__text">Languages: </p>
     <span class="country-list__span">${Object.values(country.languages).join(
       ', '
     )}</span>
     </li>
     </ul>`
    )
    .join('');
}

function cuntriesRender(countries = []) {
  return countries
    .map(
      country =>
        `<li class="country-list__item">
      <img class="image" src="${country.flags.svg}" alt="flag" width="40" height="30">
      <p>${country.name.official}</p>
    </li>`
    )
    .join('');
}

function clearInput() {
  refs.countriesListEl.innerHTML = '';
  refs.countryInfoEl.innerHTML = '';
}

refs.inputSearch.addEventListener(
  'input',
  debounce(onInputChange, DEBOUNCE_DELAY)
);
