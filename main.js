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
  // Check the checkbox status to set what units of measurement to use
  const { checked } = document.querySelector('#degree');
  let metricOrImperial = 'metric';
  if (checked) {
    metricOrImperial = 'imperial';
  }
  return metricOrImperial;
}

function createWeatherObject(currentWeatherJson) {
  // Pass data from the weather API into objects to be used in DOM manipulation
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
  // Call the geolocate API function to get the Latitude and Longitude

  const locationInput = document.querySelector('#location').value;
  const geoResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${locationInput}&limit=1&appid=384c33a1f7efd974300cacdf649178d3`, { mode: 'cors' });

  const geoJson = await geoResponse.json();

  if (geoJson.length === 0) {
    throw new Error('Can\'t find the latitude and longitude of that location');
  }
  return geoJson;
}

async function currentWeatherAPICall(latitude, longitude) {
  // Call the weather API and get the current weather.
  const metricOrImperial = getUnits();
  const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${metricOrImperial}&appid=384c33a1f7efd974300cacdf649178d3`, { mode: 'cors' });
  const currentWeatherJson = await currentWeatherResponse.json();
  return currentWeatherJson;
}

async function hourlyWeatherAPICall(latitude, longitude) {
  // Call the weather API to get the next 4 days weather in hour format
  const metricOrImperial = getUnits();
  const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=${metricOrImperial}&appid=384c33a1f7efd974300cacdf649178d3`, { mode: 'cors' });
  const weatherJson = await weatherResponse.json();
  return weatherJson;
}

async function getCurrentWeather(latitude, longitude) {
  const currentWeatherJson = await currentWeatherAPICall(latitude, longitude);

  if (currentWeatherJson) {
    const weatherObj = createWeatherObject(currentWeatherJson);
    weatherObj.city = currentWeatherJson.name;
    return weatherObj;
  }
}

async function getHourlyWeather(latitude, longitude) {
  const hourlyWeatherJson = await hourlyWeatherAPICall(latitude, longitude);

  if (hourlyWeatherJson) {
    const hourlyWeatherList = [];
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
  const locationText = document.querySelector('#location').value;
  let celOrFar = '\u2103';
  let milesPhOrMeterPh = 'm/h';
  if (checkbox.checked) {
    celOrFar = '\u2109';
    milesPhOrMeterPh = 'mph';
  }
  city.textContent = locationText;

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
    tdIconImg.src = (0,_weatherIconHandler__WEBPACK_IMPORTED_MODULE_0__["default"])(weatherObj.icon);
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
const check = document.querySelector('#degree');
check.checked = false;

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const inputBox = document.querySelector('#location');
  if (inputBox.value === '') {
    inputBox.classList.add('error');
    return;
  }
  inputBox.classList.remove('error');

  _js_apiFunctions__WEBPACK_IMPORTED_MODULE_0__.geolocateAPICall()
    .then((json) => {
      const { lat } = json[0];
      const { lon } = json[0];
      const currentWeatherPromise = _js_apiFunctions__WEBPACK_IMPORTED_MODULE_0__.getCurrentWeather(lat, lon);
      const hourlyWeatherPromise = _js_apiFunctions__WEBPACK_IMPORTED_MODULE_0__.getHourlyWeather(lat, lon);
      return Promise.all([currentWeatherPromise, hourlyWeatherPromise]);
    })
    .then((weatherObjects) => {
      _js_domManipulation__WEBPACK_IMPORTED_MODULE_1__.displayCurrentWeather(weatherObjects[0]);
      _js_domManipulation__WEBPACK_IMPORTED_MODULE_1__.displayHourlyWeather(weatherObjects[1]);
    })
    .catch((err) => {
      console.error(err);
      alert(err);
    });
});

check.addEventListener('click', () => {
  const label = document.querySelector('#label');
  console.log('test');
  if (check.checked) {
    label.textContent = '\u2109';
  } else {
    label.textContent = '\u2103';
  }
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvanMvYXBpRnVuY3Rpb25zLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2pzL2RvbU1hbmlwdWxhdGlvbi5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9qcy93ZWF0aGVySWNvbkhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBnZXRVbml0cygpIHtcbiAgLy8gQ2hlY2sgdGhlIGNoZWNrYm94IHN0YXR1cyB0byBzZXQgd2hhdCB1bml0cyBvZiBtZWFzdXJlbWVudCB0byB1c2VcbiAgY29uc3QgeyBjaGVja2VkIH0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVncmVlJyk7XG4gIGxldCBtZXRyaWNPckltcGVyaWFsID0gJ21ldHJpYyc7XG4gIGlmIChjaGVja2VkKSB7XG4gICAgbWV0cmljT3JJbXBlcmlhbCA9ICdpbXBlcmlhbCc7XG4gIH1cbiAgcmV0dXJuIG1ldHJpY09ySW1wZXJpYWw7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVdlYXRoZXJPYmplY3QoY3VycmVudFdlYXRoZXJKc29uKSB7XG4gIC8vIFBhc3MgZGF0YSBmcm9tIHRoZSB3ZWF0aGVyIEFQSSBpbnRvIG9iamVjdHMgdG8gYmUgdXNlZCBpbiBET00gbWFuaXB1bGF0aW9uXG4gIGNvbnN0IGZlZWxMaWtlID0gY3VycmVudFdlYXRoZXJKc29uLm1haW4uZmVlbHNfbGlrZTtcbiAgY29uc3QgeyB0ZW1wIH0gPSBjdXJyZW50V2VhdGhlckpzb24ubWFpbjtcbiAgY29uc3QgaHVtaWQgPSBjdXJyZW50V2VhdGhlckpzb24ubWFpbi5odW1pZGl0eTtcbiAgY29uc3QgdGVtcE1heCA9IGN1cnJlbnRXZWF0aGVySnNvbi5tYWluLnRlbXBfbWF4O1xuICBjb25zdCB0ZW1wTWluID0gY3VycmVudFdlYXRoZXJKc29uLm1haW4udGVtcF9taW47XG5cbiAgY29uc3Qgd2VhdGhlclN0YXRlID0gY3VycmVudFdlYXRoZXJKc29uLndlYXRoZXJbMF0ubWFpbjtcbiAgY29uc3Qgd2VhdGhlcklkID0gY3VycmVudFdlYXRoZXJKc29uLndlYXRoZXJbMF0uaWQ7XG4gIGNvbnN0IGljb25JZCA9IGN1cnJlbnRXZWF0aGVySnNvbi53ZWF0aGVyWzBdLmljb247XG5cbiAgY29uc3Qgd2luZE1QUyA9IGN1cnJlbnRXZWF0aGVySnNvbi53aW5kLnNwZWVkO1xuICBjb25zdCB3aW5kRGVnID0gY3VycmVudFdlYXRoZXJKc29uLndpbmQuZGVnO1xuXG4gIGNvbnN0IHdlYXRoZXJPYmogPSB7XG4gICAgdGVtcGVyYXR1cmU6IHRlbXAsXG4gICAgdGVtcGVyYXR1cmVGZWVsOiBmZWVsTGlrZSxcbiAgICB0ZW1wZXJhdHVyZU1heDogdGVtcE1heCxcbiAgICB0ZW1wZXJhdHVyZU1pbjogdGVtcE1pbixcbiAgICBodW1pZGl0eTogaHVtaWQsXG4gICAgd2VhdGhlcjogd2VhdGhlclN0YXRlLFxuICAgIGlkOiB3ZWF0aGVySWQsXG4gICAgaWNvbjogaWNvbklkLFxuICAgIHdpbmRTcGVlZDogd2luZE1QUyxcbiAgICB3aW5kRGVncmVlOiB3aW5kRGVnLFxuICB9O1xuICByZXR1cm4gd2VhdGhlck9iajtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2VvbG9jYXRlQVBJQ2FsbCgpIHtcbiAgLy8gQ2FsbCB0aGUgZ2VvbG9jYXRlIEFQSSBmdW5jdGlvbiB0byBnZXQgdGhlIExhdGl0dWRlIGFuZCBMb25naXR1ZGVcblxuICBjb25zdCBsb2NhdGlvbklucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xvY2F0aW9uJykudmFsdWU7XG4gIGNvbnN0IGdlb1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2dlby8xLjAvZGlyZWN0P3E9JHtsb2NhdGlvbklucHV0fSZsaW1pdD0xJmFwcGlkPTM4NGMzM2ExZjdlZmQ5NzQzMDBjYWNkZjY0OTE3OGQzYCwgeyBtb2RlOiAnY29ycycgfSk7XG5cbiAgY29uc3QgZ2VvSnNvbiA9IGF3YWl0IGdlb1Jlc3BvbnNlLmpzb24oKTtcblxuICBpZiAoZ2VvSnNvbi5sZW5ndGggPT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhblxcJ3QgZmluZCB0aGUgbGF0aXR1ZGUgYW5kIGxvbmdpdHVkZSBvZiB0aGF0IGxvY2F0aW9uJyk7XG4gIH1cbiAgcmV0dXJuIGdlb0pzb247XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGN1cnJlbnRXZWF0aGVyQVBJQ2FsbChsYXRpdHVkZSwgbG9uZ2l0dWRlKSB7XG4gIC8vIENhbGwgdGhlIHdlYXRoZXIgQVBJIGFuZCBnZXQgdGhlIGN1cnJlbnQgd2VhdGhlci5cbiAgY29uc3QgbWV0cmljT3JJbXBlcmlhbCA9IGdldFVuaXRzKCk7XG4gIGNvbnN0IGN1cnJlbnRXZWF0aGVyUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/bGF0PSR7bGF0aXR1ZGV9Jmxvbj0ke2xvbmdpdHVkZX0mdW5pdHM9JHttZXRyaWNPckltcGVyaWFsfSZhcHBpZD0zODRjMzNhMWY3ZWZkOTc0MzAwY2FjZGY2NDkxNzhkM2AsIHsgbW9kZTogJ2NvcnMnIH0pO1xuICBjb25zdCBjdXJyZW50V2VhdGhlckpzb24gPSBhd2FpdCBjdXJyZW50V2VhdGhlclJlc3BvbnNlLmpzb24oKTtcbiAgcmV0dXJuIGN1cnJlbnRXZWF0aGVySnNvbjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaG91cmx5V2VhdGhlckFQSUNhbGwobGF0aXR1ZGUsIGxvbmdpdHVkZSkge1xuICAvLyBDYWxsIHRoZSB3ZWF0aGVyIEFQSSB0byBnZXQgdGhlIG5leHQgNCBkYXlzIHdlYXRoZXIgaW4gaG91ciBmb3JtYXRcbiAgY29uc3QgbWV0cmljT3JJbXBlcmlhbCA9IGdldFVuaXRzKCk7XG4gIGNvbnN0IHdlYXRoZXJSZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvZm9yZWNhc3Q/bGF0PSR7bGF0aXR1ZGV9Jmxvbj0ke2xvbmdpdHVkZX0mdW5pdHM9JHttZXRyaWNPckltcGVyaWFsfSZhcHBpZD0zODRjMzNhMWY3ZWZkOTc0MzAwY2FjZGY2NDkxNzhkM2AsIHsgbW9kZTogJ2NvcnMnIH0pO1xuICBjb25zdCB3ZWF0aGVySnNvbiA9IGF3YWl0IHdlYXRoZXJSZXNwb25zZS5qc29uKCk7XG4gIHJldHVybiB3ZWF0aGVySnNvbjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0Q3VycmVudFdlYXRoZXIobGF0aXR1ZGUsIGxvbmdpdHVkZSkge1xuICBjb25zdCBjdXJyZW50V2VhdGhlckpzb24gPSBhd2FpdCBjdXJyZW50V2VhdGhlckFQSUNhbGwobGF0aXR1ZGUsIGxvbmdpdHVkZSk7XG5cbiAgaWYgKGN1cnJlbnRXZWF0aGVySnNvbikge1xuICAgIGNvbnN0IHdlYXRoZXJPYmogPSBjcmVhdGVXZWF0aGVyT2JqZWN0KGN1cnJlbnRXZWF0aGVySnNvbik7XG4gICAgd2VhdGhlck9iai5jaXR5ID0gY3VycmVudFdlYXRoZXJKc29uLm5hbWU7XG4gICAgcmV0dXJuIHdlYXRoZXJPYmo7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0SG91cmx5V2VhdGhlcihsYXRpdHVkZSwgbG9uZ2l0dWRlKSB7XG4gIGNvbnN0IGhvdXJseVdlYXRoZXJKc29uID0gYXdhaXQgaG91cmx5V2VhdGhlckFQSUNhbGwobGF0aXR1ZGUsIGxvbmdpdHVkZSk7XG5cbiAgaWYgKGhvdXJseVdlYXRoZXJKc29uKSB7XG4gICAgY29uc3QgaG91cmx5V2VhdGhlckxpc3QgPSBbXTtcbiAgICBjb25zdCB3ZWF0aGVyTGlzdCA9IGhvdXJseVdlYXRoZXJKc29uLmxpc3Q7XG4gICAgd2VhdGhlckxpc3QuZm9yRWFjaCgoaG91cmx5V2VhdGhlcikgPT4ge1xuICAgICAgY29uc3Qgd2VhdGhlck9iaiA9IGNyZWF0ZVdlYXRoZXJPYmplY3QoaG91cmx5V2VhdGhlcik7XG4gICAgICB3ZWF0aGVyT2JqLmRhdGUgPSBob3VybHlXZWF0aGVyLmR0X3R4dDtcbiAgICAgIGhvdXJseVdlYXRoZXJMaXN0LnB1c2god2VhdGhlck9iaik7XG4gICAgfSk7XG4gICAgcmV0dXJuIGhvdXJseVdlYXRoZXJMaXN0O1xuICB9XG59XG5cbmV4cG9ydCB7XG4gIGdlb2xvY2F0ZUFQSUNhbGwsIGN1cnJlbnRXZWF0aGVyQVBJQ2FsbCwgZ2V0Q3VycmVudFdlYXRoZXIsIGdldEhvdXJseVdlYXRoZXIsXG59O1xuIiwiaW1wb3J0IHNldFdlYXRoZXJJY29uIGZyb20gJy4vd2VhdGhlckljb25IYW5kbGVyJztcblxuZnVuY3Rpb24gZGlzcGxheUN1cnJlbnRXZWF0aGVyKHdlYXRoZXJPYmopIHtcbiAgY29uc3Qgd2VhdGhlckNhcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2VhdGhlci1jYXJkJyk7XG4gIGNvbnN0IGNpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2l0eScpO1xuICBjb25zdCBpY29uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2ljb24nKTtcbiAgY29uc3Qgd2VhdGhlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3ZWF0aGVyJyk7XG4gIGNvbnN0IHRlbXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdGVtcCcpO1xuICBjb25zdCB0ZW1wRmVlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0ZW1wRmVlbCcpO1xuICBjb25zdCBodW1pZGl0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNodW1pZGl0eScpO1xuICBjb25zdCB3aW5kID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dpbmQnKTtcbiAgY29uc3Qgd2luZERlZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3aW5kRGVnJyk7XG4gIGNvbnN0IGNoZWNrYm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlZ3JlZScpO1xuICBjb25zdCBsb2NhdGlvblRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbG9jYXRpb24nKS52YWx1ZTtcbiAgbGV0IGNlbE9yRmFyID0gJ1xcdTIxMDMnO1xuICBsZXQgbWlsZXNQaE9yTWV0ZXJQaCA9ICdtL2gnO1xuICBpZiAoY2hlY2tib3guY2hlY2tlZCkge1xuICAgIGNlbE9yRmFyID0gJ1xcdTIxMDknO1xuICAgIG1pbGVzUGhPck1ldGVyUGggPSAnbXBoJztcbiAgfVxuICBjaXR5LnRleHRDb250ZW50ID0gbG9jYXRpb25UZXh0O1xuXG4gIGljb24uc3JjID0gc2V0V2VhdGhlckljb24od2VhdGhlck9iai5pY29uKTtcbiAgd2VhdGhlci50ZXh0Q29udGVudCA9IHdlYXRoZXJPYmoud2VhdGhlcjtcbiAgdGVtcC50ZXh0Q29udGVudCA9IGBUZW1wZXJhdHVyZTogJHt3ZWF0aGVyT2JqLnRlbXBlcmF0dXJlfSAke2NlbE9yRmFyfWA7XG4gIHRlbXBGZWVsLnRleHRDb250ZW50ID0gYEZlZWxzIExpa2U6ICR7d2VhdGhlck9iai50ZW1wZXJhdHVyZUZlZWx9ICR7Y2VsT3JGYXJ9YDtcbiAgaHVtaWRpdHkudGV4dENvbnRlbnQgPSBgSHVtaWRpdHk6ICR7d2VhdGhlck9iai5odW1pZGl0eX0lYDtcbiAgd2luZC50ZXh0Q29udGVudCA9IGBXaW5kIFNwZWVkOiAke3dlYXRoZXJPYmoud2luZFNwZWVkfSR7bWlsZXNQaE9yTWV0ZXJQaH1gO1xuICB3aW5kRGVnLnRleHRDb250ZW50ID0gYFdpbmQgRGVncmVlOiAke3dlYXRoZXJPYmoud2luZERlZ3JlZX1cXHUwMEIwYDtcblxuICB3ZWF0aGVyQ2FyZC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xufVxuXG5mdW5jdGlvbiBkaXNwbGF5SG91cmx5V2VhdGhlcihob3VybHlXZWF0aGVyTGlzdCkge1xuICBjb25zdCB0YWJsZUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ob3VybHktd2VhdGhlcicpO1xuICBjb25zdCB0YWJsZUJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFibGUtYm9keScpO1xuICBjb25zdCBjaGVja2JveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZWdyZWUnKTtcblxuICB0YWJsZUJvZHkuaW5uZXJIVE1MID0gJyc7XG4gIGxldCBjZWxPckZhciA9ICdcXHUyMTAzJztcbiAgbGV0IG1pbGVzUGhPck1ldGVyUGggPSAnbS9oJztcbiAgaWYgKGNoZWNrYm94LmNoZWNrZWQpIHtcbiAgICBjZWxPckZhciA9ICdcXHUyMTA5JztcbiAgICBtaWxlc1BoT3JNZXRlclBoID0gJ21waCc7XG4gIH1cblxuICBob3VybHlXZWF0aGVyTGlzdC5mb3JFYWNoKCh3ZWF0aGVyT2JqKSA9PiB7XG4gICAgY29uc3QgdGFibGVSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xuICAgIGNvbnN0IHRkVGltZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgY29uc3QgdGRJY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBjb25zdCB0ZFRlbXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGNvbnN0IHRkV2VhdGhlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgY29uc3QgdGRGZWVscyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgY29uc3QgdGRXaW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBjb25zdCB0ZEh1bWlkaXR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBjb25zdCB0ZEljb25JbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUod2VhdGhlck9iai5kYXRlKS50b0xvY2FsZVN0cmluZygnZGVmYXVsdCcsIHtcbiAgICAgIHdlZWtkYXk6ICdzaG9ydCcsIG1vbnRoOiAnc2hvcnQnLCBkYXk6ICcyLWRpZ2l0JywgaG91cjogJzItZGlnaXQnLCBtaW51dGU6ICcyLWRpZ2l0JyxcbiAgICB9KTtcblxuICAgIHRkVGltZS50ZXh0Q29udGVudCA9IGRhdGU7XG4gICAgdGRJY29uSW1nLnNyYyA9IHNldFdlYXRoZXJJY29uKHdlYXRoZXJPYmouaWNvbik7XG4gICAgdGRUZW1wLnRleHRDb250ZW50ID0gYCR7d2VhdGhlck9iai50ZW1wZXJhdHVyZX0gJHtjZWxPckZhcn1gO1xuICAgIHRkV2VhdGhlci50ZXh0Q29udGVudCA9IHdlYXRoZXJPYmoud2VhdGhlcjtcbiAgICB0ZEZlZWxzLnRleHRDb250ZW50ID0gYCR7d2VhdGhlck9iai50ZW1wZXJhdHVyZUZlZWx9ICR7Y2VsT3JGYXJ9YDtcbiAgICB0ZFdpbmQudGV4dENvbnRlbnQgPSBgJHt3ZWF0aGVyT2JqLndpbmRTcGVlZH0ke21pbGVzUGhPck1ldGVyUGh9YDtcbiAgICB0ZEh1bWlkaXR5LnRleHRDb250ZW50ID0gYCR7d2VhdGhlck9iai5odW1pZGl0eX0lYDtcbiAgICB0ZEljb24uYXBwZW5kQ2hpbGQodGRJY29uSW1nKTtcbiAgICB0YWJsZVJvdy5hcHBlbmQodGRUaW1lLCB0ZEljb24sIHRkVGVtcCwgdGRXZWF0aGVyLCB0ZEZlZWxzLCB0ZFdpbmQsIHRkSHVtaWRpdHkpO1xuICAgIHRhYmxlQm9keS5hcHBlbmRDaGlsZCh0YWJsZVJvdyk7XG5cbiAgICB0YWJsZUNvbnRhaW5lci5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgIHRkSWNvbkltZy5jbGFzc0xpc3QuYWRkKCd0YWJsZS1pY29uJyk7XG4gIH0pO1xufVxuXG5leHBvcnQgeyBkaXNwbGF5Q3VycmVudFdlYXRoZXIsIGRpc3BsYXlIb3VybHlXZWF0aGVyIH07XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZXRXZWF0aGVySWNvbihpY29uKSB7XG4gIHJldHVybiBgaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvd24vJHtpY29ufUAyeC5wbmdgO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgKiBhcyB3ZWF0aGVyQXBpIGZyb20gJy4vanMvYXBpRnVuY3Rpb25zJztcbmltcG9ydCAqIGFzIGRvbU1hbmlwdWxhdGlvbiBmcm9tICcuL2pzL2RvbU1hbmlwdWxhdGlvbic7XG5cbmNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbG9jYXRpb25Gb3JtJyk7XG5jb25zdCBjaGVjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZWdyZWUnKTtcbmNoZWNrLmNoZWNrZWQgPSBmYWxzZTtcblxuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZXZlbnQpID0+IHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgY29uc3QgaW5wdXRCb3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbG9jYXRpb24nKTtcbiAgaWYgKGlucHV0Qm94LnZhbHVlID09PSAnJykge1xuICAgIGlucHV0Qm94LmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlucHV0Qm94LmNsYXNzTGlzdC5yZW1vdmUoJ2Vycm9yJyk7XG5cbiAgd2VhdGhlckFwaS5nZW9sb2NhdGVBUElDYWxsKClcbiAgICAudGhlbigoanNvbikgPT4ge1xuICAgICAgY29uc3QgeyBsYXQgfSA9IGpzb25bMF07XG4gICAgICBjb25zdCB7IGxvbiB9ID0ganNvblswXTtcbiAgICAgIGNvbnN0IGN1cnJlbnRXZWF0aGVyUHJvbWlzZSA9IHdlYXRoZXJBcGkuZ2V0Q3VycmVudFdlYXRoZXIobGF0LCBsb24pO1xuICAgICAgY29uc3QgaG91cmx5V2VhdGhlclByb21pc2UgPSB3ZWF0aGVyQXBpLmdldEhvdXJseVdlYXRoZXIobGF0LCBsb24pO1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtjdXJyZW50V2VhdGhlclByb21pc2UsIGhvdXJseVdlYXRoZXJQcm9taXNlXSk7XG4gICAgfSlcbiAgICAudGhlbigod2VhdGhlck9iamVjdHMpID0+IHtcbiAgICAgIGRvbU1hbmlwdWxhdGlvbi5kaXNwbGF5Q3VycmVudFdlYXRoZXIod2VhdGhlck9iamVjdHNbMF0pO1xuICAgICAgZG9tTWFuaXB1bGF0aW9uLmRpc3BsYXlIb3VybHlXZWF0aGVyKHdlYXRoZXJPYmplY3RzWzFdKTtcbiAgICB9KVxuICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICBhbGVydChlcnIpO1xuICAgIH0pO1xufSk7XG5cbmNoZWNrLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsYWJlbCcpO1xuICBjb25zb2xlLmxvZygndGVzdCcpO1xuICBpZiAoY2hlY2suY2hlY2tlZCkge1xuICAgIGxhYmVsLnRleHRDb250ZW50ID0gJ1xcdTIxMDknO1xuICB9IGVsc2Uge1xuICAgIGxhYmVsLnRleHRDb250ZW50ID0gJ1xcdTIxMDMnO1xuICB9XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==