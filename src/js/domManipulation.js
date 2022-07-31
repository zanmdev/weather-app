function displayCurrentWeather(weatherObj) {
  const city = document.querySelector('#city');
  const weather = document.querySelector('#weather');
  const weatherDesc = document.querySelector('#weatherDesc');
  const temp = document.querySelector('#temp');
  const tempFeel = document.querySelector('#tempFeel');
  const wind = document.querySelector('#wind');
  const windDeg = document.querySelector('#windDeg');
  const checkbox = document.querySelector('#degree');
  let celOrFar = '\u2103';
  let milesPhOrMeterPh = 'm/h';
  if (checkbox.checked) {
    celOrFar = '\u2109';
    milesPhOrMeterPh = 'mph';
  }

  city.textContent = weatherObj.name;
  weather.textContent = weatherObj.weather;
  weatherDesc.textContent = weatherObj.description;
  temp.textContent = `${weatherObj.temperature} ${celOrFar}`;
  tempFeel.textContent = `${weatherObj.temperatureFeel} ${celOrFar}`;
  wind.textContent = `${weatherObj.windSpeed} ${milesPhOrMeterPh}`;
  windDeg.textContent = `${weatherObj.windDegree} \u00B0`;
}

function displayHourlyWeather() {

}

export { displayCurrentWeather, displayHourlyWeather };
