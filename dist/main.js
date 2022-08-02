/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/apiFunctions.js":
/*!********************************!*\
  !*** ./src/js/apiFunctions.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "currentWeatherAPICall": () => (/* binding */ currentWeatherAPICall),
/* harmony export */   "geolocateAPICall": () => (/* binding */ geolocateAPICall),
/* harmony export */   "getCurrentWeather": () => (/* binding */ getCurrentWeather),
/* harmony export */   "getHourlyWeather": () => (/* binding */ getHourlyWeather)
/* harmony export */ });
function getUnits() {
  const { checked } = document.querySelector('#degree');
  let metricOrImperial = 'metric';
  if (checked) {
    metricOrImperial = 'imperial';
  }
  return metricOrImperial;
}

function createWeatherObject(currentWeatherJson) {
  const feelLike = currentWeatherJson.main.feels_like;
  const { temp } = currentWeatherJson.main;
  const humid = currentWeatherJson.main.humidity;
  const tempMax = currentWeatherJson.main.temp_max;
  const tempMin = currentWeatherJson.main.temp_min;

  const weatherState = currentWeatherJson.weather[0].main;
  const weatherId = currentWeatherJson.weather[0].id;
  const iconId = currentWeatherJson.weather[0].icon;

  const windMPS = currentWeatherJson.wind.speed;
  const windDeg = currentWeatherJson.wind.deg;

  const weatherObj = {
    temperature: temp,
    temperatureFeel: feelLike,
    temperatureMax: tempMax,
    temperatureMin: tempMin,
    humidity: humid,
    weather: weatherState,
    id: weatherId,
    icon: iconId,
    windSpeed: windMPS,
    windDegree: windDeg,
  };
  return weatherObj;
}

async function geolocateAPICall() {
  const locationInput = document.querySelector('#location').value;
  const geoResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${locationInput}&limit=1&appid=384c33a1f7efd974300cacdf649178d3`, { mode: 'cors' });
  const geoJson = await geoResponse.json();
  return geoJson;
}

async function currentWeatherAPICall(latitude, longitude) {
  console.log(`Lat:${latitude} , Lon: ${longitude}`);
  const metricOrImperial = getUnits();
  const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${metricOrImperial}&appid=384c33a1f7efd974300cacdf649178d3`, { mode: 'cors' });
  const currentWeatherJson = await currentWeatherResponse.json();
  return currentWeatherJson;
}

async function hourlyWeatherAPICall(latitude, longitude) {
  const metricOrImperial = getUnits();
  console.log(metricOrImperial);
  const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=${metricOrImperial}&appid=384c33a1f7efd974300cacdf649178d3`, { mode: 'cors' });
  const weatherJson = await weatherResponse.json();
  return weatherJson;
}

async function getCurrentWeather() {
  let currentWeatherJson;
  try {
    const json = await geolocateAPICall();
    if (json.length > 0) {
      currentWeatherJson = await currentWeatherAPICall(json[0].lat, json[0].lon);
    } else {
      throw new Error('Can\'t find location with that name');
    }
  } catch (err) {
    console.error(err);
    alert(err);
  }
  if (currentWeatherJson) {
    const weatherObj = createWeatherObject(currentWeatherJson);
    weatherObj.city = currentWeatherJson.name;
    return weatherObj;
  }
}

async function getHourlyWeather() {
  let hourlyWeatherJson;
  try {
    const json = await geolocateAPICall();
    if (json.length > 0) {
      hourlyWeatherJson = await hourlyWeatherAPICall(json[0].lat, json[0].lon);
    } else {
      throw new Error('Can\'t find location with that name');
    }
  } catch (err) {
    console.error(err);
    alert(err);
  }

  if (hourlyWeatherJson) {
    const hourlyWeatherList = [];
    console.log(hourlyWeatherJson);
    const weatherList = hourlyWeatherJson.list;
    weatherList.forEach((hourlyWeather) => {
      const weatherObj = createWeatherObject(hourlyWeather);
      weatherObj.date = hourlyWeather.dt_txt;
      hourlyWeatherList.push(weatherObj);
    });
    return hourlyWeatherList;
  }
}




/***/ }),

/***/ "./src/js/domManipulation.js":
/*!***********************************!*\
  !*** ./src/js/domManipulation.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "displayCurrentWeather": () => (/* binding */ displayCurrentWeather),
/* harmony export */   "displayHourlyWeather": () => (/* binding */ displayHourlyWeather)
/* harmony export */ });
/* harmony import */ var _weatherIconHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./weatherIconHandler */ "./src/js/weatherIconHandler.js");


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
  city.textContent = weatherObj.name;

  icon.src = (0,_weatherIconHandler__WEBPACK_IMPORTED_MODULE_0__["default"])(weatherObj.icon);
  weather.textContent = weatherObj.weather;
  temp.textContent = `Temperature: ${weatherObj.temperature} ${celOrFar}`;
  tempFeel.textContent = `Feels Like: ${weatherObj.temperatureFeel} ${celOrFar}`;
  humidity.textContent = `Humidity: ${weatherObj.humidity}%`;
  wind.textContent = `Wind Speed: ${weatherObj.windSpeed}${milesPhOrMeterPh}`;
  windDeg.textContent = `Wind Degree: ${weatherObj.windDegree}\u00B0`;

  weatherCard.style.visibility = 'visible';
}

function displayHourlyWeather(hourlyWeatherList) {
  const tableBody = document.querySelector('.body-table');
  tableBody.innerHTML = '';
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

    tdTime.textContent = weatherObj.date;
    tdIconImg.src = (0,_weatherIconHandler__WEBPACK_IMPORTED_MODULE_0__["default"])(weatherObj.icon);
    tdTemp.textContent = weatherObj.temperature;
    tdWeather.textContent = weatherObj.weather;
    tdFeels.textContent = weatherObj.temperatureFeel;
    tdWind.textContent = weatherObj.windSpeed;
    tdHumidity.textContent = `${weatherObj.humidity}%`;
    tdIcon.appendChild(tdIconImg);
    tableRow.append(tdTime, tdIcon, tdTemp, tdWeather, tdFeels, tdWind, tdHumidity);
    tableBody.appendChild(tableRow);
  });
}




/***/ }),

/***/ "./src/js/weatherIconHandler.js":
/*!**************************************!*\
  !*** ./src/js/weatherIconHandler.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ setWeatherIcon)
/* harmony export */ });
function setWeatherIcon(icon) {
  return `http://openweathermap.org/img/wn/${icon}@2x.png`;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_apiFunctions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/apiFunctions */ "./src/js/apiFunctions.js");
/* harmony import */ var _js_domManipulation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./js/domManipulation */ "./src/js/domManipulation.js");



const form = document.querySelector('#locationForm');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const inputBox = document.querySelector('#location');
  if (inputBox.value === '') {
    inputBox.classList.add('error');
    return;
  }
  inputBox.classList.remove('error');

  const currentWeatherPromise = _js_apiFunctions__WEBPACK_IMPORTED_MODULE_0__.getCurrentWeather();
  const hourlyWeatherPromise = _js_apiFunctions__WEBPACK_IMPORTED_MODULE_0__.getHourlyWeather();
  Promise.all([currentWeatherPromise, hourlyWeatherPromise])
    .then((weatherObjects) => {
      _js_domManipulation__WEBPACK_IMPORTED_MODULE_1__.displayCurrentWeather(weatherObjects[0]);
      _js_domManipulation__WEBPACK_IMPORTED_MODULE_1__.displayHourlyWeather(weatherObjects[1]);
    });
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0EsVUFBVSxVQUFVO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVSxPQUFPO0FBQ2pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvRkFBb0YsY0FBYyxvREFBb0QsY0FBYztBQUNwSztBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUIsVUFBVSxTQUFTLFVBQVU7QUFDbEQ7QUFDQSxvR0FBb0csU0FBUyxPQUFPLFVBQVUsU0FBUyxpQkFBaUIsNENBQTRDLGNBQWM7QUFDbE47QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDhGQUE4RixTQUFTLE9BQU8sVUFBVSxTQUFTLGlCQUFpQiw0Q0FBNEMsY0FBYztBQUM1TTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFJRTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5R2dEOztBQUVsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsYUFBYSwrREFBYztBQUMzQjtBQUNBLHFDQUFxQyx3QkFBd0IsRUFBRSxTQUFTO0FBQ3hFLHdDQUF3Qyw0QkFBNEIsRUFBRSxTQUFTO0FBQy9FLHNDQUFzQyxvQkFBb0I7QUFDMUQsb0NBQW9DLHFCQUFxQixFQUFFLGlCQUFpQjtBQUM1RSx3Q0FBd0Msc0JBQXNCOztBQUU5RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLCtEQUFjO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLG9CQUFvQjtBQUNwRDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRXVEOzs7Ozs7Ozs7Ozs7Ozs7QUMzRHhDO0FBQ2YsNkNBQTZDLEtBQUs7QUFDbEQ7Ozs7Ozs7VUNGQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ05nRDtBQUNROztBQUV4RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdDQUFnQywrREFBNEI7QUFDNUQsK0JBQStCLDhEQUEyQjtBQUMxRDtBQUNBO0FBQ0EsTUFBTSxzRUFBcUM7QUFDM0MsTUFBTSxxRUFBb0M7QUFDMUMsS0FBSztBQUNMLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9qcy9hcGlGdW5jdGlvbnMuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvanMvZG9tTWFuaXB1bGF0aW9uLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2pzL3dlYXRoZXJJY29uSGFuZGxlci5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGdldFVuaXRzKCkge1xuICBjb25zdCB7IGNoZWNrZWQgfSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZWdyZWUnKTtcbiAgbGV0IG1ldHJpY09ySW1wZXJpYWwgPSAnbWV0cmljJztcbiAgaWYgKGNoZWNrZWQpIHtcbiAgICBtZXRyaWNPckltcGVyaWFsID0gJ2ltcGVyaWFsJztcbiAgfVxuICByZXR1cm4gbWV0cmljT3JJbXBlcmlhbDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlV2VhdGhlck9iamVjdChjdXJyZW50V2VhdGhlckpzb24pIHtcbiAgY29uc3QgZmVlbExpa2UgPSBjdXJyZW50V2VhdGhlckpzb24ubWFpbi5mZWVsc19saWtlO1xuICBjb25zdCB7IHRlbXAgfSA9IGN1cnJlbnRXZWF0aGVySnNvbi5tYWluO1xuICBjb25zdCBodW1pZCA9IGN1cnJlbnRXZWF0aGVySnNvbi5tYWluLmh1bWlkaXR5O1xuICBjb25zdCB0ZW1wTWF4ID0gY3VycmVudFdlYXRoZXJKc29uLm1haW4udGVtcF9tYXg7XG4gIGNvbnN0IHRlbXBNaW4gPSBjdXJyZW50V2VhdGhlckpzb24ubWFpbi50ZW1wX21pbjtcblxuICBjb25zdCB3ZWF0aGVyU3RhdGUgPSBjdXJyZW50V2VhdGhlckpzb24ud2VhdGhlclswXS5tYWluO1xuICBjb25zdCB3ZWF0aGVySWQgPSBjdXJyZW50V2VhdGhlckpzb24ud2VhdGhlclswXS5pZDtcbiAgY29uc3QgaWNvbklkID0gY3VycmVudFdlYXRoZXJKc29uLndlYXRoZXJbMF0uaWNvbjtcblxuICBjb25zdCB3aW5kTVBTID0gY3VycmVudFdlYXRoZXJKc29uLndpbmQuc3BlZWQ7XG4gIGNvbnN0IHdpbmREZWcgPSBjdXJyZW50V2VhdGhlckpzb24ud2luZC5kZWc7XG5cbiAgY29uc3Qgd2VhdGhlck9iaiA9IHtcbiAgICB0ZW1wZXJhdHVyZTogdGVtcCxcbiAgICB0ZW1wZXJhdHVyZUZlZWw6IGZlZWxMaWtlLFxuICAgIHRlbXBlcmF0dXJlTWF4OiB0ZW1wTWF4LFxuICAgIHRlbXBlcmF0dXJlTWluOiB0ZW1wTWluLFxuICAgIGh1bWlkaXR5OiBodW1pZCxcbiAgICB3ZWF0aGVyOiB3ZWF0aGVyU3RhdGUsXG4gICAgaWQ6IHdlYXRoZXJJZCxcbiAgICBpY29uOiBpY29uSWQsXG4gICAgd2luZFNwZWVkOiB3aW5kTVBTLFxuICAgIHdpbmREZWdyZWU6IHdpbmREZWcsXG4gIH07XG4gIHJldHVybiB3ZWF0aGVyT2JqO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZW9sb2NhdGVBUElDYWxsKCkge1xuICBjb25zdCBsb2NhdGlvbklucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xvY2F0aW9uJykudmFsdWU7XG4gIGNvbnN0IGdlb1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2dlby8xLjAvZGlyZWN0P3E9JHtsb2NhdGlvbklucHV0fSZsaW1pdD0xJmFwcGlkPTM4NGMzM2ExZjdlZmQ5NzQzMDBjYWNkZjY0OTE3OGQzYCwgeyBtb2RlOiAnY29ycycgfSk7XG4gIGNvbnN0IGdlb0pzb24gPSBhd2FpdCBnZW9SZXNwb25zZS5qc29uKCk7XG4gIHJldHVybiBnZW9Kc29uO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjdXJyZW50V2VhdGhlckFQSUNhbGwobGF0aXR1ZGUsIGxvbmdpdHVkZSkge1xuICBjb25zb2xlLmxvZyhgTGF0OiR7bGF0aXR1ZGV9ICwgTG9uOiAke2xvbmdpdHVkZX1gKTtcbiAgY29uc3QgbWV0cmljT3JJbXBlcmlhbCA9IGdldFVuaXRzKCk7XG4gIGNvbnN0IGN1cnJlbnRXZWF0aGVyUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/bGF0PSR7bGF0aXR1ZGV9Jmxvbj0ke2xvbmdpdHVkZX0mdW5pdHM9JHttZXRyaWNPckltcGVyaWFsfSZhcHBpZD0zODRjMzNhMWY3ZWZkOTc0MzAwY2FjZGY2NDkxNzhkM2AsIHsgbW9kZTogJ2NvcnMnIH0pO1xuICBjb25zdCBjdXJyZW50V2VhdGhlckpzb24gPSBhd2FpdCBjdXJyZW50V2VhdGhlclJlc3BvbnNlLmpzb24oKTtcbiAgcmV0dXJuIGN1cnJlbnRXZWF0aGVySnNvbjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaG91cmx5V2VhdGhlckFQSUNhbGwobGF0aXR1ZGUsIGxvbmdpdHVkZSkge1xuICBjb25zdCBtZXRyaWNPckltcGVyaWFsID0gZ2V0VW5pdHMoKTtcbiAgY29uc29sZS5sb2cobWV0cmljT3JJbXBlcmlhbCk7XG4gIGNvbnN0IHdlYXRoZXJSZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvZm9yZWNhc3Q/bGF0PSR7bGF0aXR1ZGV9Jmxvbj0ke2xvbmdpdHVkZX0mdW5pdHM9JHttZXRyaWNPckltcGVyaWFsfSZhcHBpZD0zODRjMzNhMWY3ZWZkOTc0MzAwY2FjZGY2NDkxNzhkM2AsIHsgbW9kZTogJ2NvcnMnIH0pO1xuICBjb25zdCB3ZWF0aGVySnNvbiA9IGF3YWl0IHdlYXRoZXJSZXNwb25zZS5qc29uKCk7XG4gIHJldHVybiB3ZWF0aGVySnNvbjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0Q3VycmVudFdlYXRoZXIoKSB7XG4gIGxldCBjdXJyZW50V2VhdGhlckpzb247XG4gIHRyeSB7XG4gICAgY29uc3QganNvbiA9IGF3YWl0IGdlb2xvY2F0ZUFQSUNhbGwoKTtcbiAgICBpZiAoanNvbi5sZW5ndGggPiAwKSB7XG4gICAgICBjdXJyZW50V2VhdGhlckpzb24gPSBhd2FpdCBjdXJyZW50V2VhdGhlckFQSUNhbGwoanNvblswXS5sYXQsIGpzb25bMF0ubG9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5cXCd0IGZpbmQgbG9jYXRpb24gd2l0aCB0aGF0IG5hbWUnKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICBhbGVydChlcnIpO1xuICB9XG4gIGlmIChjdXJyZW50V2VhdGhlckpzb24pIHtcbiAgICBjb25zdCB3ZWF0aGVyT2JqID0gY3JlYXRlV2VhdGhlck9iamVjdChjdXJyZW50V2VhdGhlckpzb24pO1xuICAgIHdlYXRoZXJPYmouY2l0eSA9IGN1cnJlbnRXZWF0aGVySnNvbi5uYW1lO1xuICAgIHJldHVybiB3ZWF0aGVyT2JqO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEhvdXJseVdlYXRoZXIoKSB7XG4gIGxldCBob3VybHlXZWF0aGVySnNvbjtcbiAgdHJ5IHtcbiAgICBjb25zdCBqc29uID0gYXdhaXQgZ2VvbG9jYXRlQVBJQ2FsbCgpO1xuICAgIGlmIChqc29uLmxlbmd0aCA+IDApIHtcbiAgICAgIGhvdXJseVdlYXRoZXJKc29uID0gYXdhaXQgaG91cmx5V2VhdGhlckFQSUNhbGwoanNvblswXS5sYXQsIGpzb25bMF0ubG9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5cXCd0IGZpbmQgbG9jYXRpb24gd2l0aCB0aGF0IG5hbWUnKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICBhbGVydChlcnIpO1xuICB9XG5cbiAgaWYgKGhvdXJseVdlYXRoZXJKc29uKSB7XG4gICAgY29uc3QgaG91cmx5V2VhdGhlckxpc3QgPSBbXTtcbiAgICBjb25zb2xlLmxvZyhob3VybHlXZWF0aGVySnNvbik7XG4gICAgY29uc3Qgd2VhdGhlckxpc3QgPSBob3VybHlXZWF0aGVySnNvbi5saXN0O1xuICAgIHdlYXRoZXJMaXN0LmZvckVhY2goKGhvdXJseVdlYXRoZXIpID0+IHtcbiAgICAgIGNvbnN0IHdlYXRoZXJPYmogPSBjcmVhdGVXZWF0aGVyT2JqZWN0KGhvdXJseVdlYXRoZXIpO1xuICAgICAgd2VhdGhlck9iai5kYXRlID0gaG91cmx5V2VhdGhlci5kdF90eHQ7XG4gICAgICBob3VybHlXZWF0aGVyTGlzdC5wdXNoKHdlYXRoZXJPYmopO1xuICAgIH0pO1xuICAgIHJldHVybiBob3VybHlXZWF0aGVyTGlzdDtcbiAgfVxufVxuXG5leHBvcnQge1xuICBnZW9sb2NhdGVBUElDYWxsLCBjdXJyZW50V2VhdGhlckFQSUNhbGwsIGdldEN1cnJlbnRXZWF0aGVyLCBnZXRIb3VybHlXZWF0aGVyLFxufTtcbiIsImltcG9ydCBzZXRXZWF0aGVySWNvbiBmcm9tICcuL3dlYXRoZXJJY29uSGFuZGxlcic7XG5cbmZ1bmN0aW9uIGRpc3BsYXlDdXJyZW50V2VhdGhlcih3ZWF0aGVyT2JqKSB7XG4gIGNvbnN0IHdlYXRoZXJDYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndlYXRoZXItY2FyZCcpO1xuICBjb25zdCBjaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NpdHknKTtcbiAgY29uc3QgaWNvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNpY29uJyk7XG4gIGNvbnN0IHdlYXRoZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd2VhdGhlcicpO1xuICBjb25zdCB0ZW1wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RlbXAnKTtcbiAgY29uc3QgdGVtcEZlZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdGVtcEZlZWwnKTtcbiAgY29uc3QgaHVtaWRpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaHVtaWRpdHknKTtcbiAgY29uc3Qgd2luZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3aW5kJyk7XG4gIGNvbnN0IHdpbmREZWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd2luZERlZycpO1xuICBjb25zdCBjaGVja2JveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZWdyZWUnKTtcbiAgbGV0IGNlbE9yRmFyID0gJ1xcdTIxMDMnO1xuICBsZXQgbWlsZXNQaE9yTWV0ZXJQaCA9ICdtL2gnO1xuICBpZiAoY2hlY2tib3guY2hlY2tlZCkge1xuICAgIGNlbE9yRmFyID0gJ1xcdTIxMDknO1xuICAgIG1pbGVzUGhPck1ldGVyUGggPSAnbXBoJztcbiAgfVxuICBjaXR5LnRleHRDb250ZW50ID0gd2VhdGhlck9iai5uYW1lO1xuXG4gIGljb24uc3JjID0gc2V0V2VhdGhlckljb24od2VhdGhlck9iai5pY29uKTtcbiAgd2VhdGhlci50ZXh0Q29udGVudCA9IHdlYXRoZXJPYmoud2VhdGhlcjtcbiAgdGVtcC50ZXh0Q29udGVudCA9IGBUZW1wZXJhdHVyZTogJHt3ZWF0aGVyT2JqLnRlbXBlcmF0dXJlfSAke2NlbE9yRmFyfWA7XG4gIHRlbXBGZWVsLnRleHRDb250ZW50ID0gYEZlZWxzIExpa2U6ICR7d2VhdGhlck9iai50ZW1wZXJhdHVyZUZlZWx9ICR7Y2VsT3JGYXJ9YDtcbiAgaHVtaWRpdHkudGV4dENvbnRlbnQgPSBgSHVtaWRpdHk6ICR7d2VhdGhlck9iai5odW1pZGl0eX0lYDtcbiAgd2luZC50ZXh0Q29udGVudCA9IGBXaW5kIFNwZWVkOiAke3dlYXRoZXJPYmoud2luZFNwZWVkfSR7bWlsZXNQaE9yTWV0ZXJQaH1gO1xuICB3aW5kRGVnLnRleHRDb250ZW50ID0gYFdpbmQgRGVncmVlOiAke3dlYXRoZXJPYmoud2luZERlZ3JlZX1cXHUwMEIwYDtcblxuICB3ZWF0aGVyQ2FyZC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xufVxuXG5mdW5jdGlvbiBkaXNwbGF5SG91cmx5V2VhdGhlcihob3VybHlXZWF0aGVyTGlzdCkge1xuICBjb25zdCB0YWJsZUJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9keS10YWJsZScpO1xuICB0YWJsZUJvZHkuaW5uZXJIVE1MID0gJyc7XG4gIGhvdXJseVdlYXRoZXJMaXN0LmZvckVhY2goKHdlYXRoZXJPYmopID0+IHtcbiAgICBjb25zdCB0YWJsZVJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG4gICAgY29uc3QgdGRUaW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBjb25zdCB0ZEljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGNvbnN0IHRkVGVtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgY29uc3QgdGRXZWF0aGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBjb25zdCB0ZEZlZWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBjb25zdCB0ZFdpbmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGNvbnN0IHRkSHVtaWRpdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGNvbnN0IHRkSWNvbkltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXG4gICAgdGRUaW1lLnRleHRDb250ZW50ID0gd2VhdGhlck9iai5kYXRlO1xuICAgIHRkSWNvbkltZy5zcmMgPSBzZXRXZWF0aGVySWNvbih3ZWF0aGVyT2JqLmljb24pO1xuICAgIHRkVGVtcC50ZXh0Q29udGVudCA9IHdlYXRoZXJPYmoudGVtcGVyYXR1cmU7XG4gICAgdGRXZWF0aGVyLnRleHRDb250ZW50ID0gd2VhdGhlck9iai53ZWF0aGVyO1xuICAgIHRkRmVlbHMudGV4dENvbnRlbnQgPSB3ZWF0aGVyT2JqLnRlbXBlcmF0dXJlRmVlbDtcbiAgICB0ZFdpbmQudGV4dENvbnRlbnQgPSB3ZWF0aGVyT2JqLndpbmRTcGVlZDtcbiAgICB0ZEh1bWlkaXR5LnRleHRDb250ZW50ID0gYCR7d2VhdGhlck9iai5odW1pZGl0eX0lYDtcbiAgICB0ZEljb24uYXBwZW5kQ2hpbGQodGRJY29uSW1nKTtcbiAgICB0YWJsZVJvdy5hcHBlbmQodGRUaW1lLCB0ZEljb24sIHRkVGVtcCwgdGRXZWF0aGVyLCB0ZEZlZWxzLCB0ZFdpbmQsIHRkSHVtaWRpdHkpO1xuICAgIHRhYmxlQm9keS5hcHBlbmRDaGlsZCh0YWJsZVJvdyk7XG4gIH0pO1xufVxuXG5leHBvcnQgeyBkaXNwbGF5Q3VycmVudFdlYXRoZXIsIGRpc3BsYXlIb3VybHlXZWF0aGVyIH07XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZXRXZWF0aGVySWNvbihpY29uKSB7XG4gIHJldHVybiBgaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvd24vJHtpY29ufUAyeC5wbmdgO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgKiBhcyB3ZWF0aGVyQXBpIGZyb20gJy4vanMvYXBpRnVuY3Rpb25zJztcbmltcG9ydCAqIGFzIGRvbU1hbmlwdWxhdGlvbiBmcm9tICcuL2pzL2RvbU1hbmlwdWxhdGlvbic7XG5cbmNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbG9jYXRpb25Gb3JtJyk7XG5cbmZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGV2ZW50KSA9PiB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIGNvbnN0IGlucHV0Qm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xvY2F0aW9uJyk7XG4gIGlmIChpbnB1dEJveC52YWx1ZSA9PT0gJycpIHtcbiAgICBpbnB1dEJveC5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xuICAgIHJldHVybjtcbiAgfVxuICBpbnB1dEJveC5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvcicpO1xuXG4gIGNvbnN0IGN1cnJlbnRXZWF0aGVyUHJvbWlzZSA9IHdlYXRoZXJBcGkuZ2V0Q3VycmVudFdlYXRoZXIoKTtcbiAgY29uc3QgaG91cmx5V2VhdGhlclByb21pc2UgPSB3ZWF0aGVyQXBpLmdldEhvdXJseVdlYXRoZXIoKTtcbiAgUHJvbWlzZS5hbGwoW2N1cnJlbnRXZWF0aGVyUHJvbWlzZSwgaG91cmx5V2VhdGhlclByb21pc2VdKVxuICAgIC50aGVuKCh3ZWF0aGVyT2JqZWN0cykgPT4ge1xuICAgICAgZG9tTWFuaXB1bGF0aW9uLmRpc3BsYXlDdXJyZW50V2VhdGhlcih3ZWF0aGVyT2JqZWN0c1swXSk7XG4gICAgICBkb21NYW5pcHVsYXRpb24uZGlzcGxheUhvdXJseVdlYXRoZXIod2VhdGhlck9iamVjdHNbMV0pO1xuICAgIH0pO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=