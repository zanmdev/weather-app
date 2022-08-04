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

  weatherApi.geolocateAPICall()

    .then((json) => {
      const { lat } = json[0];
      const { lon } = json[0];
      const currentWeatherPromise = weatherApi.getCurrentWeather(lat, lon);
      const hourlyWeatherPromise = weatherApi.getHourlyWeather(lat, lon);
      return Promise.all([currentWeatherPromise, hourlyWeatherPromise]);
    })
    .then((weatherObjects) => {
      domManipulation.displayCurrentWeather(weatherObjects[0]);
      domManipulation.displayHourlyWeather(weatherObjects[1]);
    })
    .catch((err) => {
      console.error(err);
      alert(err);
    });
});
