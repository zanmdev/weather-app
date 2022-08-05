import setWeatherIcon from './weatherImageHandler';
import clear from '../asset/clear.jpg';

function setBackgroundImage(id) {
  const main = document.querySelector('main');
  main.style.backgroundImage = `url(${clear})`;
}

function displayCurrentWeather(weatherObj) {
  const weatherCard = document.querySelector('.weather-card');
  const city = document.querySelector('#city');
  const icon = document.querySelector('#icon');
  const weather = document.querySelector('#weather');
  const temp = document.querySelector('#temp');
  const tempFeel = document.querySelector('#tempFeel');
  const humidity = document.querySelector('#humidity');
  const wind = document.querySelector('#wind');
  const windDeg = document.querySelector('#windDeg');
  const checkbox = document.querySelector('#degree');
  let celOrFar = '\u2103';
  let milesPhOrMeterPh = 'm/h';
  if (checkbox.checked) {
    celOrFar = '\u2109';
    milesPhOrMeterPh = 'mph';
  }
  setBackgroundImage(weatherObj.id);
  city.textContent = weatherObj.city;

  icon.src = setWeatherIcon(weatherObj.icon);
  weather.textContent = weatherObj.weather;
  temp.textContent = `Temperature: ${weatherObj.temperature} ${celOrFar}`;
  tempFeel.textContent = `Feels Like: ${weatherObj.temperatureFeel} ${celOrFar}`;
  humidity.textContent = `Humidity: ${weatherObj.humidity}%`;
  wind.textContent = `Wind Speed: ${weatherObj.windSpeed}${milesPhOrMeterPh}`;
  windDeg.textContent = `Wind Degree: ${weatherObj.windDegree}\u00B0`;

  weatherCard.style.visibility = 'visible';
}

function displayHourlyWeather(hourlyWeatherList) {
  const tableContainer = document.querySelector('.hourly-weather');
  const tableBody = document.querySelector('.table-body');
  const checkbox = document.querySelector('#degree');

  tableBody.innerHTML = '';
  let celOrFar = '\u2103';
  let milesPhOrMeterPh = 'm/h';
  if (checkbox.checked) {
    celOrFar = '\u2109';
    milesPhOrMeterPh = 'mph';
  }

  hourlyWeatherList.forEach((weatherObj) => {
    const tableRow = document.createElement('tr');
    const tdTime = document.createElement('td');
    const tdIcon = document.createElement('td');
    const tdTemp = document.createElement('td');
    const tdWeather = document.createElement('td');
    const tdFeels = document.createElement('td');
    const tdWind = document.createElement('td');
    const tdHumidity = document.createElement('td');
    const tdIconImg = document.createElement('img');
    const date = new Date(weatherObj.date).toLocaleString('default', {
      weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit',
    });

    tdTime.textContent = date;
    tdIconImg.src = setWeatherIcon(weatherObj.icon);
    tdTemp.textContent = `${weatherObj.temperature} ${celOrFar}`;
    tdWeather.textContent = weatherObj.weather;
    tdFeels.textContent = `${weatherObj.temperatureFeel} ${celOrFar}`;
    tdWind.textContent = `${weatherObj.windSpeed}${milesPhOrMeterPh}`;
    tdHumidity.textContent = `${weatherObj.humidity}%`;
    tdIcon.appendChild(tdIconImg);
    tableRow.append(tdTime, tdIcon, tdTemp, tdWeather, tdFeels, tdWind, tdHumidity);
    tableBody.appendChild(tableRow);

    tableContainer.style.visibility = 'visible';
    tdIconImg.classList.add('table-icon');
  });
}

export { displayCurrentWeather, displayHourlyWeather };
