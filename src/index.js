import * as weatherApi from './js/apiFunctions';
import * as domManipulation from './js/domManipulation';

const form = document.querySelector('#locationForm');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const inputBox = document.querySelector('#location');
  if (inputBox.value === '') {
    inputBox.classList.add('error');
    return;
  }
  inputBox.classList.remove('error');

  const currentWeatherPromise = weatherApi.getCurrentWeather();
  const hourlyWeatherPromise = weatherApi.getHourlyWeather();
  Promise.all([currentWeatherPromise, hourlyWeatherPromise])
    .then((weatherObjects) => {
      domManipulation.displayCurrentWeather(weatherObjects[0]);
      domManipulation.displayHourlyWeather(weatherObjects[1]);
    });
});
