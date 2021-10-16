const BASE_URL = 'https://restcountries.com/v2';

export function fetchCountries(searchQuery) {
  return fetch(`${BASE_URL}/name/${searchQuery}`).then(response => response.json());
}
