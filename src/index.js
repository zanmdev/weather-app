import * as weatherApi from './js/apiFunctions';
import * as domManipulation from './js/domManipulation';

const form = document.querySelector('#locationForm');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const inputBox = document.querySelector('#location');
  if (inputBox.value === '') { return; } // Set Error handling
  weatherApi.getCurrentWeather()
    .then((obj) => {
      domManipulation.displayCurrentWeather(obj);
    });
});
