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
/* harmony import */ var _weatherImageHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./weatherImageHandler */ "./src/js/weatherImageHandler.js");


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

  icon.src = (0,_weatherImageHandler__WEBPACK_IMPORTED_MODULE_0__["default"])(weatherObj.icon);
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
    tdIconImg.src = (0,_weatherImageHandler__WEBPACK_IMPORTED_MODULE_0__["default"])(weatherObj.icon);
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

/***/ "./src/js/weatherImageHandler.js":
/*!***************************************!*\
  !*** ./src/js/weatherImageHandler.js ***!
  \***************************************/
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvanMvYXBpRnVuY3Rpb25zLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2pzL2RvbU1hbmlwdWxhdGlvbi5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9qcy93ZWF0aGVySW1hZ2VIYW5kbGVyLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gZ2V0VW5pdHMoKSB7XG4gIC8vIENoZWNrIHRoZSBjaGVja2JveCBzdGF0dXMgdG8gc2V0IHdoYXQgdW5pdHMgb2YgbWVhc3VyZW1lbnQgdG8gdXNlXG4gIGNvbnN0IHsgY2hlY2tlZCB9ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlZ3JlZScpO1xuICBsZXQgbWV0cmljT3JJbXBlcmlhbCA9ICdtZXRyaWMnO1xuICBpZiAoY2hlY2tlZCkge1xuICAgIG1ldHJpY09ySW1wZXJpYWwgPSAnaW1wZXJpYWwnO1xuICB9XG4gIHJldHVybiBtZXRyaWNPckltcGVyaWFsO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVXZWF0aGVyT2JqZWN0KGN1cnJlbnRXZWF0aGVySnNvbikge1xuICAvLyBQYXNzIGRhdGEgZnJvbSB0aGUgd2VhdGhlciBBUEkgaW50byBvYmplY3RzIHRvIGJlIHVzZWQgaW4gRE9NIG1hbmlwdWxhdGlvblxuICBjb25zdCBmZWVsTGlrZSA9IGN1cnJlbnRXZWF0aGVySnNvbi5tYWluLmZlZWxzX2xpa2U7XG4gIGNvbnN0IHsgdGVtcCB9ID0gY3VycmVudFdlYXRoZXJKc29uLm1haW47XG4gIGNvbnN0IGh1bWlkID0gY3VycmVudFdlYXRoZXJKc29uLm1haW4uaHVtaWRpdHk7XG4gIGNvbnN0IHRlbXBNYXggPSBjdXJyZW50V2VhdGhlckpzb24ubWFpbi50ZW1wX21heDtcbiAgY29uc3QgdGVtcE1pbiA9IGN1cnJlbnRXZWF0aGVySnNvbi5tYWluLnRlbXBfbWluO1xuXG4gIGNvbnN0IHdlYXRoZXJTdGF0ZSA9IGN1cnJlbnRXZWF0aGVySnNvbi53ZWF0aGVyWzBdLm1haW47XG4gIGNvbnN0IHdlYXRoZXJJZCA9IGN1cnJlbnRXZWF0aGVySnNvbi53ZWF0aGVyWzBdLmlkO1xuICBjb25zdCBpY29uSWQgPSBjdXJyZW50V2VhdGhlckpzb24ud2VhdGhlclswXS5pY29uO1xuXG4gIGNvbnN0IHdpbmRNUFMgPSBjdXJyZW50V2VhdGhlckpzb24ud2luZC5zcGVlZDtcbiAgY29uc3Qgd2luZERlZyA9IGN1cnJlbnRXZWF0aGVySnNvbi53aW5kLmRlZztcblxuICBjb25zdCB3ZWF0aGVyT2JqID0ge1xuICAgIHRlbXBlcmF0dXJlOiB0ZW1wLFxuICAgIHRlbXBlcmF0dXJlRmVlbDogZmVlbExpa2UsXG4gICAgdGVtcGVyYXR1cmVNYXg6IHRlbXBNYXgsXG4gICAgdGVtcGVyYXR1cmVNaW46IHRlbXBNaW4sXG4gICAgaHVtaWRpdHk6IGh1bWlkLFxuICAgIHdlYXRoZXI6IHdlYXRoZXJTdGF0ZSxcbiAgICBpZDogd2VhdGhlcklkLFxuICAgIGljb246IGljb25JZCxcbiAgICB3aW5kU3BlZWQ6IHdpbmRNUFMsXG4gICAgd2luZERlZ3JlZTogd2luZERlZyxcbiAgfTtcbiAgcmV0dXJuIHdlYXRoZXJPYmo7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdlb2xvY2F0ZUFQSUNhbGwoKSB7XG4gIC8vIENhbGwgdGhlIGdlb2xvY2F0ZSBBUEkgZnVuY3Rpb24gdG8gZ2V0IHRoZSBMYXRpdHVkZSBhbmQgTG9uZ2l0dWRlXG5cbiAgY29uc3QgbG9jYXRpb25JbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2NhdGlvbicpLnZhbHVlO1xuICBjb25zdCBnZW9SZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9nZW8vMS4wL2RpcmVjdD9xPSR7bG9jYXRpb25JbnB1dH0mbGltaXQ9MSZhcHBpZD0zODRjMzNhMWY3ZWZkOTc0MzAwY2FjZGY2NDkxNzhkM2AsIHsgbW9kZTogJ2NvcnMnIH0pO1xuXG4gIGNvbnN0IGdlb0pzb24gPSBhd2FpdCBnZW9SZXNwb25zZS5qc29uKCk7XG5cbiAgaWYgKGdlb0pzb24ubGVuZ3RoID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5cXCd0IGZpbmQgdGhlIGxhdGl0dWRlIGFuZCBsb25naXR1ZGUgb2YgdGhhdCBsb2NhdGlvbicpO1xuICB9XG4gIHJldHVybiBnZW9Kc29uO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjdXJyZW50V2VhdGhlckFQSUNhbGwobGF0aXR1ZGUsIGxvbmdpdHVkZSkge1xuICAvLyBDYWxsIHRoZSB3ZWF0aGVyIEFQSSBhbmQgZ2V0IHRoZSBjdXJyZW50IHdlYXRoZXIuXG4gIGNvbnN0IG1ldHJpY09ySW1wZXJpYWwgPSBnZXRVbml0cygpO1xuICBjb25zdCBjdXJyZW50V2VhdGhlclJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP2xhdD0ke2xhdGl0dWRlfSZsb249JHtsb25naXR1ZGV9JnVuaXRzPSR7bWV0cmljT3JJbXBlcmlhbH0mYXBwaWQ9Mzg0YzMzYTFmN2VmZDk3NDMwMGNhY2RmNjQ5MTc4ZDNgLCB7IG1vZGU6ICdjb3JzJyB9KTtcbiAgY29uc3QgY3VycmVudFdlYXRoZXJKc29uID0gYXdhaXQgY3VycmVudFdlYXRoZXJSZXNwb25zZS5qc29uKCk7XG4gIHJldHVybiBjdXJyZW50V2VhdGhlckpzb247XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGhvdXJseVdlYXRoZXJBUElDYWxsKGxhdGl0dWRlLCBsb25naXR1ZGUpIHtcbiAgLy8gQ2FsbCB0aGUgd2VhdGhlciBBUEkgdG8gZ2V0IHRoZSBuZXh0IDQgZGF5cyB3ZWF0aGVyIGluIGhvdXIgZm9ybWF0XG4gIGNvbnN0IG1ldHJpY09ySW1wZXJpYWwgPSBnZXRVbml0cygpO1xuICBjb25zdCB3ZWF0aGVyUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L2ZvcmVjYXN0P2xhdD0ke2xhdGl0dWRlfSZsb249JHtsb25naXR1ZGV9JnVuaXRzPSR7bWV0cmljT3JJbXBlcmlhbH0mYXBwaWQ9Mzg0YzMzYTFmN2VmZDk3NDMwMGNhY2RmNjQ5MTc4ZDNgLCB7IG1vZGU6ICdjb3JzJyB9KTtcbiAgY29uc3Qgd2VhdGhlckpzb24gPSBhd2FpdCB3ZWF0aGVyUmVzcG9uc2UuanNvbigpO1xuICByZXR1cm4gd2VhdGhlckpzb247XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEN1cnJlbnRXZWF0aGVyKGxhdGl0dWRlLCBsb25naXR1ZGUpIHtcbiAgY29uc3QgY3VycmVudFdlYXRoZXJKc29uID0gYXdhaXQgY3VycmVudFdlYXRoZXJBUElDYWxsKGxhdGl0dWRlLCBsb25naXR1ZGUpO1xuXG4gIGlmIChjdXJyZW50V2VhdGhlckpzb24pIHtcbiAgICBjb25zdCB3ZWF0aGVyT2JqID0gY3JlYXRlV2VhdGhlck9iamVjdChjdXJyZW50V2VhdGhlckpzb24pO1xuICAgIHdlYXRoZXJPYmouY2l0eSA9IGN1cnJlbnRXZWF0aGVySnNvbi5uYW1lO1xuICAgIHJldHVybiB3ZWF0aGVyT2JqO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEhvdXJseVdlYXRoZXIobGF0aXR1ZGUsIGxvbmdpdHVkZSkge1xuICBjb25zdCBob3VybHlXZWF0aGVySnNvbiA9IGF3YWl0IGhvdXJseVdlYXRoZXJBUElDYWxsKGxhdGl0dWRlLCBsb25naXR1ZGUpO1xuXG4gIGlmIChob3VybHlXZWF0aGVySnNvbikge1xuICAgIGNvbnN0IGhvdXJseVdlYXRoZXJMaXN0ID0gW107XG4gICAgY29uc3Qgd2VhdGhlckxpc3QgPSBob3VybHlXZWF0aGVySnNvbi5saXN0O1xuICAgIHdlYXRoZXJMaXN0LmZvckVhY2goKGhvdXJseVdlYXRoZXIpID0+IHtcbiAgICAgIGNvbnN0IHdlYXRoZXJPYmogPSBjcmVhdGVXZWF0aGVyT2JqZWN0KGhvdXJseVdlYXRoZXIpO1xuICAgICAgd2VhdGhlck9iai5kYXRlID0gaG91cmx5V2VhdGhlci5kdF90eHQ7XG4gICAgICBob3VybHlXZWF0aGVyTGlzdC5wdXNoKHdlYXRoZXJPYmopO1xuICAgIH0pO1xuICAgIHJldHVybiBob3VybHlXZWF0aGVyTGlzdDtcbiAgfVxufVxuXG5leHBvcnQge1xuICBnZW9sb2NhdGVBUElDYWxsLCBjdXJyZW50V2VhdGhlckFQSUNhbGwsIGdldEN1cnJlbnRXZWF0aGVyLCBnZXRIb3VybHlXZWF0aGVyLFxufTtcbiIsImltcG9ydCBzZXRXZWF0aGVySWNvbiBmcm9tICcuL3dlYXRoZXJJbWFnZUhhbmRsZXInO1xuXG5mdW5jdGlvbiBkaXNwbGF5Q3VycmVudFdlYXRoZXIod2VhdGhlck9iaikge1xuICBjb25zdCB3ZWF0aGVyQ2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53ZWF0aGVyLWNhcmQnKTtcbiAgY29uc3QgY2l0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjaXR5Jyk7XG4gIGNvbnN0IGljb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaWNvbicpO1xuICBjb25zdCB3ZWF0aGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dlYXRoZXInKTtcbiAgY29uc3QgdGVtcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0ZW1wJyk7XG4gIGNvbnN0IHRlbXBGZWVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RlbXBGZWVsJyk7XG4gIGNvbnN0IGh1bWlkaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2h1bWlkaXR5Jyk7XG4gIGNvbnN0IHdpbmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd2luZCcpO1xuICBjb25zdCB3aW5kRGVnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dpbmREZWcnKTtcbiAgY29uc3QgY2hlY2tib3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVncmVlJyk7XG4gIGNvbnN0IGxvY2F0aW9uVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2NhdGlvbicpLnZhbHVlO1xuICBsZXQgY2VsT3JGYXIgPSAnXFx1MjEwMyc7XG4gIGxldCBtaWxlc1BoT3JNZXRlclBoID0gJ20vaCc7XG4gIGlmIChjaGVja2JveC5jaGVja2VkKSB7XG4gICAgY2VsT3JGYXIgPSAnXFx1MjEwOSc7XG4gICAgbWlsZXNQaE9yTWV0ZXJQaCA9ICdtcGgnO1xuICB9XG4gIGNpdHkudGV4dENvbnRlbnQgPSBsb2NhdGlvblRleHQ7XG5cbiAgaWNvbi5zcmMgPSBzZXRXZWF0aGVySWNvbih3ZWF0aGVyT2JqLmljb24pO1xuICB3ZWF0aGVyLnRleHRDb250ZW50ID0gd2VhdGhlck9iai53ZWF0aGVyO1xuICB0ZW1wLnRleHRDb250ZW50ID0gYFRlbXBlcmF0dXJlOiAke3dlYXRoZXJPYmoudGVtcGVyYXR1cmV9ICR7Y2VsT3JGYXJ9YDtcbiAgdGVtcEZlZWwudGV4dENvbnRlbnQgPSBgRmVlbHMgTGlrZTogJHt3ZWF0aGVyT2JqLnRlbXBlcmF0dXJlRmVlbH0gJHtjZWxPckZhcn1gO1xuICBodW1pZGl0eS50ZXh0Q29udGVudCA9IGBIdW1pZGl0eTogJHt3ZWF0aGVyT2JqLmh1bWlkaXR5fSVgO1xuICB3aW5kLnRleHRDb250ZW50ID0gYFdpbmQgU3BlZWQ6ICR7d2VhdGhlck9iai53aW5kU3BlZWR9JHttaWxlc1BoT3JNZXRlclBofWA7XG4gIHdpbmREZWcudGV4dENvbnRlbnQgPSBgV2luZCBEZWdyZWU6ICR7d2VhdGhlck9iai53aW5kRGVncmVlfVxcdTAwQjBgO1xuXG4gIHdlYXRoZXJDYXJkLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlIb3VybHlXZWF0aGVyKGhvdXJseVdlYXRoZXJMaXN0KSB7XG4gIGNvbnN0IHRhYmxlQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhvdXJseS13ZWF0aGVyJyk7XG4gIGNvbnN0IHRhYmxlQm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YWJsZS1ib2R5Jyk7XG4gIGNvbnN0IGNoZWNrYm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlZ3JlZScpO1xuXG4gIHRhYmxlQm9keS5pbm5lckhUTUwgPSAnJztcbiAgbGV0IGNlbE9yRmFyID0gJ1xcdTIxMDMnO1xuICBsZXQgbWlsZXNQaE9yTWV0ZXJQaCA9ICdtL2gnO1xuICBpZiAoY2hlY2tib3guY2hlY2tlZCkge1xuICAgIGNlbE9yRmFyID0gJ1xcdTIxMDknO1xuICAgIG1pbGVzUGhPck1ldGVyUGggPSAnbXBoJztcbiAgfVxuXG4gIGhvdXJseVdlYXRoZXJMaXN0LmZvckVhY2goKHdlYXRoZXJPYmopID0+IHtcbiAgICBjb25zdCB0YWJsZVJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG4gICAgY29uc3QgdGRUaW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBjb25zdCB0ZEljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGNvbnN0IHRkVGVtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgY29uc3QgdGRXZWF0aGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBjb25zdCB0ZEZlZWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBjb25zdCB0ZFdpbmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGNvbnN0IHRkSHVtaWRpdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGNvbnN0IHRkSWNvbkltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh3ZWF0aGVyT2JqLmRhdGUpLnRvTG9jYWxlU3RyaW5nKCdkZWZhdWx0Jywge1xuICAgICAgd2Vla2RheTogJ3Nob3J0JywgbW9udGg6ICdzaG9ydCcsIGRheTogJzItZGlnaXQnLCBob3VyOiAnMi1kaWdpdCcsIG1pbnV0ZTogJzItZGlnaXQnLFxuICAgIH0pO1xuXG4gICAgdGRUaW1lLnRleHRDb250ZW50ID0gZGF0ZTtcbiAgICB0ZEljb25JbWcuc3JjID0gc2V0V2VhdGhlckljb24od2VhdGhlck9iai5pY29uKTtcbiAgICB0ZFRlbXAudGV4dENvbnRlbnQgPSBgJHt3ZWF0aGVyT2JqLnRlbXBlcmF0dXJlfSAke2NlbE9yRmFyfWA7XG4gICAgdGRXZWF0aGVyLnRleHRDb250ZW50ID0gd2VhdGhlck9iai53ZWF0aGVyO1xuICAgIHRkRmVlbHMudGV4dENvbnRlbnQgPSBgJHt3ZWF0aGVyT2JqLnRlbXBlcmF0dXJlRmVlbH0gJHtjZWxPckZhcn1gO1xuICAgIHRkV2luZC50ZXh0Q29udGVudCA9IGAke3dlYXRoZXJPYmoud2luZFNwZWVkfSR7bWlsZXNQaE9yTWV0ZXJQaH1gO1xuICAgIHRkSHVtaWRpdHkudGV4dENvbnRlbnQgPSBgJHt3ZWF0aGVyT2JqLmh1bWlkaXR5fSVgO1xuICAgIHRkSWNvbi5hcHBlbmRDaGlsZCh0ZEljb25JbWcpO1xuICAgIHRhYmxlUm93LmFwcGVuZCh0ZFRpbWUsIHRkSWNvbiwgdGRUZW1wLCB0ZFdlYXRoZXIsIHRkRmVlbHMsIHRkV2luZCwgdGRIdW1pZGl0eSk7XG4gICAgdGFibGVCb2R5LmFwcGVuZENoaWxkKHRhYmxlUm93KTtcblxuICAgIHRhYmxlQ29udGFpbmVyLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgdGRJY29uSW1nLmNsYXNzTGlzdC5hZGQoJ3RhYmxlLWljb24nKTtcbiAgfSk7XG59XG5cbmV4cG9ydCB7IGRpc3BsYXlDdXJyZW50V2VhdGhlciwgZGlzcGxheUhvdXJseVdlYXRoZXIgfTtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNldFdlYXRoZXJJY29uKGljb24pIHtcbiAgcmV0dXJuIGBodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93bi8ke2ljb259QDJ4LnBuZ2A7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAqIGFzIHdlYXRoZXJBcGkgZnJvbSAnLi9qcy9hcGlGdW5jdGlvbnMnO1xuaW1wb3J0ICogYXMgZG9tTWFuaXB1bGF0aW9uIGZyb20gJy4vanMvZG9tTWFuaXB1bGF0aW9uJztcblxuY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2NhdGlvbkZvcm0nKTtcbmNvbnN0IGNoZWNrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlZ3JlZScpO1xuY2hlY2suY2hlY2tlZCA9IGZhbHNlO1xuXG5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChldmVudCkgPT4ge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBjb25zdCBpbnB1dEJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2NhdGlvbicpO1xuICBpZiAoaW5wdXRCb3gudmFsdWUgPT09ICcnKSB7XG4gICAgaW5wdXRCb3guY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaW5wdXRCb3guY2xhc3NMaXN0LnJlbW92ZSgnZXJyb3InKTtcblxuICB3ZWF0aGVyQXBpLmdlb2xvY2F0ZUFQSUNhbGwoKVxuICAgIC50aGVuKChqc29uKSA9PiB7XG4gICAgICBjb25zdCB7IGxhdCB9ID0ganNvblswXTtcbiAgICAgIGNvbnN0IHsgbG9uIH0gPSBqc29uWzBdO1xuICAgICAgY29uc3QgY3VycmVudFdlYXRoZXJQcm9taXNlID0gd2VhdGhlckFwaS5nZXRDdXJyZW50V2VhdGhlcihsYXQsIGxvbik7XG4gICAgICBjb25zdCBob3VybHlXZWF0aGVyUHJvbWlzZSA9IHdlYXRoZXJBcGkuZ2V0SG91cmx5V2VhdGhlcihsYXQsIGxvbik7XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW2N1cnJlbnRXZWF0aGVyUHJvbWlzZSwgaG91cmx5V2VhdGhlclByb21pc2VdKTtcbiAgICB9KVxuICAgIC50aGVuKCh3ZWF0aGVyT2JqZWN0cykgPT4ge1xuICAgICAgZG9tTWFuaXB1bGF0aW9uLmRpc3BsYXlDdXJyZW50V2VhdGhlcih3ZWF0aGVyT2JqZWN0c1swXSk7XG4gICAgICBkb21NYW5pcHVsYXRpb24uZGlzcGxheUhvdXJseVdlYXRoZXIod2VhdGhlck9iamVjdHNbMV0pO1xuICAgIH0pXG4gICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIGFsZXJ0KGVycik7XG4gICAgfSk7XG59KTtcblxuY2hlY2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xhYmVsJyk7XG4gIGNvbnNvbGUubG9nKCd0ZXN0Jyk7XG4gIGlmIChjaGVjay5jaGVja2VkKSB7XG4gICAgbGFiZWwudGV4dENvbnRlbnQgPSAnXFx1MjEwOSc7XG4gIH0gZWxzZSB7XG4gICAgbGFiZWwudGV4dENvbnRlbnQgPSAnXFx1MjEwMyc7XG4gIH1cbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9