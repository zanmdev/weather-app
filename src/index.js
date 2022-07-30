import * as weatherApi from './js/apiFunctions';

const form = document.querySelector('#locationForm');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  weatherApi.getCurrentWeather()
    .then((obj) => {
      console.log(obj);
    });
});
