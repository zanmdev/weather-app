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

  console.log(geoResponse);
  const geoJson = await geoResponse.json();
  console.log(geoJson);
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
  console.log(metricOrImperial);
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
  const tableContainer = document.querySelector('.hourly-weather');
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

    tableContainer.style.visibility = 'visible';
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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQSxVQUFVLFVBQVU7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsT0FBTztBQUNqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esb0ZBQW9GLGNBQWMsb0RBQW9ELGNBQWM7O0FBRXBLO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0dBQW9HLFNBQVMsT0FBTyxVQUFVLFNBQVMsaUJBQWlCLDRDQUE0QyxjQUFjO0FBQ2xOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhGQUE4RixTQUFTLE9BQU8sVUFBVSxTQUFTLGlCQUFpQiw0Q0FBNEMsY0FBYztBQUM1TTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBSUU7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkdnRDs7QUFFbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGFBQWEsK0RBQWM7QUFDM0I7QUFDQSxxQ0FBcUMsd0JBQXdCLEVBQUUsU0FBUztBQUN4RSx3Q0FBd0MsNEJBQTRCLEVBQUUsU0FBUztBQUMvRSxzQ0FBc0Msb0JBQW9CO0FBQzFELG9DQUFvQyxxQkFBcUIsRUFBRSxpQkFBaUI7QUFDNUUsd0NBQXdDLHNCQUFzQjs7QUFFOUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLCtEQUFjO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLG9CQUFvQjtBQUNwRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7O0FBRXVEOzs7Ozs7Ozs7Ozs7Ozs7QUM5RHhDO0FBQ2YsNkNBQTZDLEtBQUs7QUFDbEQ7Ozs7Ozs7VUNGQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ05nRDtBQUNROztBQUV4RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEVBQUUsOERBQTJCOztBQUU3QjtBQUNBLGNBQWMsTUFBTTtBQUNwQixjQUFjLE1BQU07QUFDcEIsb0NBQW9DLCtEQUE0QjtBQUNoRSxtQ0FBbUMsOERBQTJCO0FBQzlEO0FBQ0EsS0FBSztBQUNMO0FBQ0EsTUFBTSxzRUFBcUM7QUFDM0MsTUFBTSxxRUFBb0M7QUFDMUMsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvanMvYXBpRnVuY3Rpb25zLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2pzL2RvbU1hbmlwdWxhdGlvbi5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9qcy93ZWF0aGVySWNvbkhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBnZXRVbml0cygpIHtcbiAgLy8gQ2hlY2sgdGhlIGNoZWNrYm94IHN0YXR1cyB0byBzZXQgd2hhdCB1bml0cyBvZiBtZWFzdXJlbWVudCB0byB1c2VcbiAgY29uc3QgeyBjaGVja2VkIH0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVncmVlJyk7XG4gIGxldCBtZXRyaWNPckltcGVyaWFsID0gJ21ldHJpYyc7XG4gIGlmIChjaGVja2VkKSB7XG4gICAgbWV0cmljT3JJbXBlcmlhbCA9ICdpbXBlcmlhbCc7XG4gIH1cbiAgcmV0dXJuIG1ldHJpY09ySW1wZXJpYWw7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVdlYXRoZXJPYmplY3QoY3VycmVudFdlYXRoZXJKc29uKSB7XG4gIC8vIFBhc3MgZGF0YSBmcm9tIHRoZSB3ZWF0aGVyIEFQSSBpbnRvIG9iamVjdHMgdG8gYmUgdXNlZCBpbiBET00gbWFuaXB1bGF0aW9uXG4gIGNvbnN0IGZlZWxMaWtlID0gY3VycmVudFdlYXRoZXJKc29uLm1haW4uZmVlbHNfbGlrZTtcbiAgY29uc3QgeyB0ZW1wIH0gPSBjdXJyZW50V2VhdGhlckpzb24ubWFpbjtcbiAgY29uc3QgaHVtaWQgPSBjdXJyZW50V2VhdGhlckpzb24ubWFpbi5odW1pZGl0eTtcbiAgY29uc3QgdGVtcE1heCA9IGN1cnJlbnRXZWF0aGVySnNvbi5tYWluLnRlbXBfbWF4O1xuICBjb25zdCB0ZW1wTWluID0gY3VycmVudFdlYXRoZXJKc29uLm1haW4udGVtcF9taW47XG5cbiAgY29uc3Qgd2VhdGhlclN0YXRlID0gY3VycmVudFdlYXRoZXJKc29uLndlYXRoZXJbMF0ubWFpbjtcbiAgY29uc3Qgd2VhdGhlcklkID0gY3VycmVudFdlYXRoZXJKc29uLndlYXRoZXJbMF0uaWQ7XG4gIGNvbnN0IGljb25JZCA9IGN1cnJlbnRXZWF0aGVySnNvbi53ZWF0aGVyWzBdLmljb247XG5cbiAgY29uc3Qgd2luZE1QUyA9IGN1cnJlbnRXZWF0aGVySnNvbi53aW5kLnNwZWVkO1xuICBjb25zdCB3aW5kRGVnID0gY3VycmVudFdlYXRoZXJKc29uLndpbmQuZGVnO1xuXG4gIGNvbnN0IHdlYXRoZXJPYmogPSB7XG4gICAgdGVtcGVyYXR1cmU6IHRlbXAsXG4gICAgdGVtcGVyYXR1cmVGZWVsOiBmZWVsTGlrZSxcbiAgICB0ZW1wZXJhdHVyZU1heDogdGVtcE1heCxcbiAgICB0ZW1wZXJhdHVyZU1pbjogdGVtcE1pbixcbiAgICBodW1pZGl0eTogaHVtaWQsXG4gICAgd2VhdGhlcjogd2VhdGhlclN0YXRlLFxuICAgIGlkOiB3ZWF0aGVySWQsXG4gICAgaWNvbjogaWNvbklkLFxuICAgIHdpbmRTcGVlZDogd2luZE1QUyxcbiAgICB3aW5kRGVncmVlOiB3aW5kRGVnLFxuICB9O1xuICByZXR1cm4gd2VhdGhlck9iajtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2VvbG9jYXRlQVBJQ2FsbCgpIHtcbiAgLy8gQ2FsbCB0aGUgZ2VvbG9jYXRlIEFQSSBmdW5jdGlvbiB0byBnZXQgdGhlIExhdGl0dWRlIGFuZCBMb25naXR1ZGVcblxuICBjb25zdCBsb2NhdGlvbklucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xvY2F0aW9uJykudmFsdWU7XG4gIGNvbnN0IGdlb1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2dlby8xLjAvZGlyZWN0P3E9JHtsb2NhdGlvbklucHV0fSZsaW1pdD0xJmFwcGlkPTM4NGMzM2ExZjdlZmQ5NzQzMDBjYWNkZjY0OTE3OGQzYCwgeyBtb2RlOiAnY29ycycgfSk7XG5cbiAgY29uc29sZS5sb2coZ2VvUmVzcG9uc2UpO1xuICBjb25zdCBnZW9Kc29uID0gYXdhaXQgZ2VvUmVzcG9uc2UuanNvbigpO1xuICBjb25zb2xlLmxvZyhnZW9Kc29uKTtcbiAgaWYgKGdlb0pzb24ubGVuZ3RoID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5cXCd0IGZpbmQgdGhlIGxhdGl0dWRlIGFuZCBsb25naXR1ZGUgb2YgdGhhdCBsb2NhdGlvbicpO1xuICB9XG4gIHJldHVybiBnZW9Kc29uO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjdXJyZW50V2VhdGhlckFQSUNhbGwobGF0aXR1ZGUsIGxvbmdpdHVkZSkge1xuICAvLyBDYWxsIHRoZSB3ZWF0aGVyIEFQSSBhbmQgZ2V0IHRoZSBjdXJyZW50IHdlYXRoZXIuXG4gIGNvbnN0IG1ldHJpY09ySW1wZXJpYWwgPSBnZXRVbml0cygpO1xuICBjb25zdCBjdXJyZW50V2VhdGhlclJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP2xhdD0ke2xhdGl0dWRlfSZsb249JHtsb25naXR1ZGV9JnVuaXRzPSR7bWV0cmljT3JJbXBlcmlhbH0mYXBwaWQ9Mzg0YzMzYTFmN2VmZDk3NDMwMGNhY2RmNjQ5MTc4ZDNgLCB7IG1vZGU6ICdjb3JzJyB9KTtcbiAgY29uc3QgY3VycmVudFdlYXRoZXJKc29uID0gYXdhaXQgY3VycmVudFdlYXRoZXJSZXNwb25zZS5qc29uKCk7XG4gIHJldHVybiBjdXJyZW50V2VhdGhlckpzb247XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGhvdXJseVdlYXRoZXJBUElDYWxsKGxhdGl0dWRlLCBsb25naXR1ZGUpIHtcbiAgLy8gQ2FsbCB0aGUgd2VhdGhlciBBUEkgdG8gZ2V0IHRoZSBuZXh0IDQgZGF5cyB3ZWF0aGVyIGluIGhvdXIgZm9ybWF0XG4gIGNvbnN0IG1ldHJpY09ySW1wZXJpYWwgPSBnZXRVbml0cygpO1xuICBjb25zb2xlLmxvZyhtZXRyaWNPckltcGVyaWFsKTtcbiAgY29uc3Qgd2VhdGhlclJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS9mb3JlY2FzdD9sYXQ9JHtsYXRpdHVkZX0mbG9uPSR7bG9uZ2l0dWRlfSZ1bml0cz0ke21ldHJpY09ySW1wZXJpYWx9JmFwcGlkPTM4NGMzM2ExZjdlZmQ5NzQzMDBjYWNkZjY0OTE3OGQzYCwgeyBtb2RlOiAnY29ycycgfSk7XG4gIGNvbnN0IHdlYXRoZXJKc29uID0gYXdhaXQgd2VhdGhlclJlc3BvbnNlLmpzb24oKTtcbiAgcmV0dXJuIHdlYXRoZXJKc29uO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRDdXJyZW50V2VhdGhlcihsYXRpdHVkZSwgbG9uZ2l0dWRlKSB7XG4gIGNvbnN0IGN1cnJlbnRXZWF0aGVySnNvbiA9IGF3YWl0IGN1cnJlbnRXZWF0aGVyQVBJQ2FsbChsYXRpdHVkZSwgbG9uZ2l0dWRlKTtcblxuICBpZiAoY3VycmVudFdlYXRoZXJKc29uKSB7XG4gICAgY29uc3Qgd2VhdGhlck9iaiA9IGNyZWF0ZVdlYXRoZXJPYmplY3QoY3VycmVudFdlYXRoZXJKc29uKTtcbiAgICB3ZWF0aGVyT2JqLmNpdHkgPSBjdXJyZW50V2VhdGhlckpzb24ubmFtZTtcbiAgICByZXR1cm4gd2VhdGhlck9iajtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRIb3VybHlXZWF0aGVyKGxhdGl0dWRlLCBsb25naXR1ZGUpIHtcbiAgY29uc3QgaG91cmx5V2VhdGhlckpzb24gPSBhd2FpdCBob3VybHlXZWF0aGVyQVBJQ2FsbChsYXRpdHVkZSwgbG9uZ2l0dWRlKTtcblxuICBpZiAoaG91cmx5V2VhdGhlckpzb24pIHtcbiAgICBjb25zdCBob3VybHlXZWF0aGVyTGlzdCA9IFtdO1xuICAgIGNvbnN0IHdlYXRoZXJMaXN0ID0gaG91cmx5V2VhdGhlckpzb24ubGlzdDtcbiAgICB3ZWF0aGVyTGlzdC5mb3JFYWNoKChob3VybHlXZWF0aGVyKSA9PiB7XG4gICAgICBjb25zdCB3ZWF0aGVyT2JqID0gY3JlYXRlV2VhdGhlck9iamVjdChob3VybHlXZWF0aGVyKTtcbiAgICAgIHdlYXRoZXJPYmouZGF0ZSA9IGhvdXJseVdlYXRoZXIuZHRfdHh0O1xuICAgICAgaG91cmx5V2VhdGhlckxpc3QucHVzaCh3ZWF0aGVyT2JqKTtcbiAgICB9KTtcbiAgICByZXR1cm4gaG91cmx5V2VhdGhlckxpc3Q7XG4gIH1cbn1cblxuZXhwb3J0IHtcbiAgZ2VvbG9jYXRlQVBJQ2FsbCwgY3VycmVudFdlYXRoZXJBUElDYWxsLCBnZXRDdXJyZW50V2VhdGhlciwgZ2V0SG91cmx5V2VhdGhlcixcbn07XG4iLCJpbXBvcnQgc2V0V2VhdGhlckljb24gZnJvbSAnLi93ZWF0aGVySWNvbkhhbmRsZXInO1xuXG5mdW5jdGlvbiBkaXNwbGF5Q3VycmVudFdlYXRoZXIod2VhdGhlck9iaikge1xuICBjb25zdCB3ZWF0aGVyQ2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53ZWF0aGVyLWNhcmQnKTtcbiAgY29uc3QgY2l0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjaXR5Jyk7XG4gIGNvbnN0IGljb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaWNvbicpO1xuICBjb25zdCB3ZWF0aGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dlYXRoZXInKTtcbiAgY29uc3QgdGVtcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0ZW1wJyk7XG4gIGNvbnN0IHRlbXBGZWVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RlbXBGZWVsJyk7XG4gIGNvbnN0IGh1bWlkaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2h1bWlkaXR5Jyk7XG4gIGNvbnN0IHdpbmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd2luZCcpO1xuICBjb25zdCB3aW5kRGVnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dpbmREZWcnKTtcbiAgY29uc3QgY2hlY2tib3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVncmVlJyk7XG4gIGxldCBjZWxPckZhciA9ICdcXHUyMTAzJztcbiAgbGV0IG1pbGVzUGhPck1ldGVyUGggPSAnbS9oJztcbiAgaWYgKGNoZWNrYm94LmNoZWNrZWQpIHtcbiAgICBjZWxPckZhciA9ICdcXHUyMTA5JztcbiAgICBtaWxlc1BoT3JNZXRlclBoID0gJ21waCc7XG4gIH1cbiAgY2l0eS50ZXh0Q29udGVudCA9IHdlYXRoZXJPYmoubmFtZTtcblxuICBpY29uLnNyYyA9IHNldFdlYXRoZXJJY29uKHdlYXRoZXJPYmouaWNvbik7XG4gIHdlYXRoZXIudGV4dENvbnRlbnQgPSB3ZWF0aGVyT2JqLndlYXRoZXI7XG4gIHRlbXAudGV4dENvbnRlbnQgPSBgVGVtcGVyYXR1cmU6ICR7d2VhdGhlck9iai50ZW1wZXJhdHVyZX0gJHtjZWxPckZhcn1gO1xuICB0ZW1wRmVlbC50ZXh0Q29udGVudCA9IGBGZWVscyBMaWtlOiAke3dlYXRoZXJPYmoudGVtcGVyYXR1cmVGZWVsfSAke2NlbE9yRmFyfWA7XG4gIGh1bWlkaXR5LnRleHRDb250ZW50ID0gYEh1bWlkaXR5OiAke3dlYXRoZXJPYmouaHVtaWRpdHl9JWA7XG4gIHdpbmQudGV4dENvbnRlbnQgPSBgV2luZCBTcGVlZDogJHt3ZWF0aGVyT2JqLndpbmRTcGVlZH0ke21pbGVzUGhPck1ldGVyUGh9YDtcbiAgd2luZERlZy50ZXh0Q29udGVudCA9IGBXaW5kIERlZ3JlZTogJHt3ZWF0aGVyT2JqLndpbmREZWdyZWV9XFx1MDBCMGA7XG5cbiAgd2VhdGhlckNhcmQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbn1cblxuZnVuY3Rpb24gZGlzcGxheUhvdXJseVdlYXRoZXIoaG91cmx5V2VhdGhlckxpc3QpIHtcbiAgY29uc3QgdGFibGVDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaG91cmx5LXdlYXRoZXInKTtcbiAgY29uc3QgdGFibGVCb2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvZHktdGFibGUnKTtcbiAgdGFibGVCb2R5LmlubmVySFRNTCA9ICcnO1xuICBob3VybHlXZWF0aGVyTGlzdC5mb3JFYWNoKCh3ZWF0aGVyT2JqKSA9PiB7XG4gICAgY29uc3QgdGFibGVSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xuICAgIGNvbnN0IHRkVGltZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgY29uc3QgdGRJY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBjb25zdCB0ZFRlbXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGNvbnN0IHRkV2VhdGhlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgY29uc3QgdGRGZWVscyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgY29uc3QgdGRXaW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBjb25zdCB0ZEh1bWlkaXR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBjb25zdCB0ZEljb25JbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcblxuICAgIHRkVGltZS50ZXh0Q29udGVudCA9IHdlYXRoZXJPYmouZGF0ZTtcbiAgICB0ZEljb25JbWcuc3JjID0gc2V0V2VhdGhlckljb24od2VhdGhlck9iai5pY29uKTtcbiAgICB0ZFRlbXAudGV4dENvbnRlbnQgPSB3ZWF0aGVyT2JqLnRlbXBlcmF0dXJlO1xuICAgIHRkV2VhdGhlci50ZXh0Q29udGVudCA9IHdlYXRoZXJPYmoud2VhdGhlcjtcbiAgICB0ZEZlZWxzLnRleHRDb250ZW50ID0gd2VhdGhlck9iai50ZW1wZXJhdHVyZUZlZWw7XG4gICAgdGRXaW5kLnRleHRDb250ZW50ID0gd2VhdGhlck9iai53aW5kU3BlZWQ7XG4gICAgdGRIdW1pZGl0eS50ZXh0Q29udGVudCA9IGAke3dlYXRoZXJPYmouaHVtaWRpdHl9JWA7XG4gICAgdGRJY29uLmFwcGVuZENoaWxkKHRkSWNvbkltZyk7XG4gICAgdGFibGVSb3cuYXBwZW5kKHRkVGltZSwgdGRJY29uLCB0ZFRlbXAsIHRkV2VhdGhlciwgdGRGZWVscywgdGRXaW5kLCB0ZEh1bWlkaXR5KTtcbiAgICB0YWJsZUJvZHkuYXBwZW5kQ2hpbGQodGFibGVSb3cpO1xuXG4gICAgdGFibGVDb250YWluZXIuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgfSk7XG59XG5cbmV4cG9ydCB7IGRpc3BsYXlDdXJyZW50V2VhdGhlciwgZGlzcGxheUhvdXJseVdlYXRoZXIgfTtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNldFdlYXRoZXJJY29uKGljb24pIHtcbiAgcmV0dXJuIGBodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93bi8ke2ljb259QDJ4LnBuZ2A7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAqIGFzIHdlYXRoZXJBcGkgZnJvbSAnLi9qcy9hcGlGdW5jdGlvbnMnO1xuaW1wb3J0ICogYXMgZG9tTWFuaXB1bGF0aW9uIGZyb20gJy4vanMvZG9tTWFuaXB1bGF0aW9uJztcblxuY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2NhdGlvbkZvcm0nKTtcblxuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZXZlbnQpID0+IHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgY29uc3QgaW5wdXRCb3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbG9jYXRpb24nKTtcbiAgaWYgKGlucHV0Qm94LnZhbHVlID09PSAnJykge1xuICAgIGlucHV0Qm94LmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlucHV0Qm94LmNsYXNzTGlzdC5yZW1vdmUoJ2Vycm9yJyk7XG5cbiAgd2VhdGhlckFwaS5nZW9sb2NhdGVBUElDYWxsKClcblxuICAgIC50aGVuKChqc29uKSA9PiB7XG4gICAgICBjb25zdCB7IGxhdCB9ID0ganNvblswXTtcbiAgICAgIGNvbnN0IHsgbG9uIH0gPSBqc29uWzBdO1xuICAgICAgY29uc3QgY3VycmVudFdlYXRoZXJQcm9taXNlID0gd2VhdGhlckFwaS5nZXRDdXJyZW50V2VhdGhlcihsYXQsIGxvbik7XG4gICAgICBjb25zdCBob3VybHlXZWF0aGVyUHJvbWlzZSA9IHdlYXRoZXJBcGkuZ2V0SG91cmx5V2VhdGhlcihsYXQsIGxvbik7XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW2N1cnJlbnRXZWF0aGVyUHJvbWlzZSwgaG91cmx5V2VhdGhlclByb21pc2VdKTtcbiAgICB9KVxuICAgIC50aGVuKCh3ZWF0aGVyT2JqZWN0cykgPT4ge1xuICAgICAgZG9tTWFuaXB1bGF0aW9uLmRpc3BsYXlDdXJyZW50V2VhdGhlcih3ZWF0aGVyT2JqZWN0c1swXSk7XG4gICAgICBkb21NYW5pcHVsYXRpb24uZGlzcGxheUhvdXJseVdlYXRoZXIod2VhdGhlck9iamVjdHNbMV0pO1xuICAgIH0pXG4gICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIGFsZXJ0KGVycik7XG4gICAgfSk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==