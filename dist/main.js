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
  if (inputBox.value === '') { return; } // Set Error handling
  _js_apiFunctions__WEBPACK_IMPORTED_MODULE_0__.getCurrentWeather()
    .then((obj) => {
      _js_domManipulation__WEBPACK_IMPORTED_MODULE_1__.displayCurrentWeather(obj);
    });
  _js_apiFunctions__WEBPACK_IMPORTED_MODULE_0__.getHourlyWeather()
    .then((obj) => {
      console.log(obj);
      _js_domManipulation__WEBPACK_IMPORTED_MODULE_1__.displayHourlyWeather(obj);
    });
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0EsVUFBVSxVQUFVO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVSxPQUFPO0FBQ2pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvRkFBb0YsY0FBYyxvREFBb0QsY0FBYztBQUNwSztBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUIsVUFBVSxTQUFTLFVBQVU7QUFDbEQ7QUFDQSxvR0FBb0csU0FBUyxPQUFPLFVBQVUsU0FBUyxpQkFBaUIsNENBQTRDLGNBQWM7QUFDbE47QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw4RkFBOEYsU0FBUyxPQUFPLFVBQVUsU0FBUyxpQkFBaUIsNENBQTRDLGNBQWM7QUFDNU07QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBSUU7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0dnRDs7QUFFbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGFBQWEsK0RBQWM7QUFDM0I7QUFDQSxxQ0FBcUMsd0JBQXdCLEVBQUUsU0FBUztBQUN4RSx3Q0FBd0MsNEJBQTRCLEVBQUUsU0FBUztBQUMvRSxzQ0FBc0Msb0JBQW9CO0FBQzFELG9DQUFvQyxxQkFBcUIsRUFBRSxpQkFBaUI7QUFDNUUsd0NBQXdDLHNCQUFzQjs7QUFFOUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0IsK0RBQWM7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0Msb0JBQW9CO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFdUQ7Ozs7Ozs7Ozs7Ozs7OztBQzFEeEM7QUFDZiw2Q0FBNkMsS0FBSztBQUNsRDs7Ozs7OztVQ0ZBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTmdEO0FBQ1E7O0FBRXhEOztBQUVBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixVQUFVO0FBQ3pDLEVBQUUsK0RBQTRCO0FBQzlCO0FBQ0EsTUFBTSxzRUFBcUM7QUFDM0MsS0FBSztBQUNMLEVBQUUsOERBQTJCO0FBQzdCO0FBQ0E7QUFDQSxNQUFNLHFFQUFvQztBQUMxQyxLQUFLO0FBQ0wsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2pzL2FwaUZ1bmN0aW9ucy5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9qcy9kb21NYW5pcHVsYXRpb24uanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvanMvd2VhdGhlckljb25IYW5kbGVyLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gZ2V0VW5pdHMoKSB7XG4gIGNvbnN0IHsgY2hlY2tlZCB9ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlZ3JlZScpO1xuICBsZXQgbWV0cmljT3JJbXBlcmlhbCA9ICdtZXRyaWMnO1xuICBpZiAoY2hlY2tlZCkge1xuICAgIG1ldHJpY09ySW1wZXJpYWwgPSAnaW1wZXJpYWwnO1xuICB9XG4gIHJldHVybiBtZXRyaWNPckltcGVyaWFsO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVXZWF0aGVyT2JqZWN0KGN1cnJlbnRXZWF0aGVySnNvbikge1xuICBjb25zdCBmZWVsTGlrZSA9IGN1cnJlbnRXZWF0aGVySnNvbi5tYWluLmZlZWxzX2xpa2U7XG4gIGNvbnN0IHsgdGVtcCB9ID0gY3VycmVudFdlYXRoZXJKc29uLm1haW47XG4gIGNvbnN0IGh1bWlkID0gY3VycmVudFdlYXRoZXJKc29uLm1haW4uaHVtaWRpdHk7XG4gIGNvbnN0IHRlbXBNYXggPSBjdXJyZW50V2VhdGhlckpzb24ubWFpbi50ZW1wX21heDtcbiAgY29uc3QgdGVtcE1pbiA9IGN1cnJlbnRXZWF0aGVySnNvbi5tYWluLnRlbXBfbWluO1xuXG4gIGNvbnN0IHdlYXRoZXJTdGF0ZSA9IGN1cnJlbnRXZWF0aGVySnNvbi53ZWF0aGVyWzBdLm1haW47XG4gIGNvbnN0IHdlYXRoZXJJZCA9IGN1cnJlbnRXZWF0aGVySnNvbi53ZWF0aGVyWzBdLmlkO1xuICBjb25zdCBpY29uSWQgPSBjdXJyZW50V2VhdGhlckpzb24ud2VhdGhlclswXS5pY29uO1xuXG4gIGNvbnN0IHdpbmRNUFMgPSBjdXJyZW50V2VhdGhlckpzb24ud2luZC5zcGVlZDtcbiAgY29uc3Qgd2luZERlZyA9IGN1cnJlbnRXZWF0aGVySnNvbi53aW5kLmRlZztcblxuICBjb25zdCB3ZWF0aGVyT2JqID0ge1xuICAgIHRlbXBlcmF0dXJlOiB0ZW1wLFxuICAgIHRlbXBlcmF0dXJlRmVlbDogZmVlbExpa2UsXG4gICAgdGVtcGVyYXR1cmVNYXg6IHRlbXBNYXgsXG4gICAgdGVtcGVyYXR1cmVNaW46IHRlbXBNaW4sXG4gICAgaHVtaWRpdHk6IGh1bWlkLFxuICAgIHdlYXRoZXI6IHdlYXRoZXJTdGF0ZSxcbiAgICBpZDogd2VhdGhlcklkLFxuICAgIGljb246IGljb25JZCxcbiAgICB3aW5kU3BlZWQ6IHdpbmRNUFMsXG4gICAgd2luZERlZ3JlZTogd2luZERlZyxcbiAgfTtcbiAgcmV0dXJuIHdlYXRoZXJPYmo7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdlb2xvY2F0ZUFQSUNhbGwoKSB7XG4gIGNvbnN0IGxvY2F0aW9uSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbG9jYXRpb24nKS52YWx1ZTtcbiAgY29uc3QgZ2VvUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cDovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZ2VvLzEuMC9kaXJlY3Q/cT0ke2xvY2F0aW9uSW5wdXR9JmxpbWl0PTEmYXBwaWQ9Mzg0YzMzYTFmN2VmZDk3NDMwMGNhY2RmNjQ5MTc4ZDNgLCB7IG1vZGU6ICdjb3JzJyB9KTtcbiAgY29uc3QgZ2VvSnNvbiA9IGF3YWl0IGdlb1Jlc3BvbnNlLmpzb24oKTtcbiAgcmV0dXJuIGdlb0pzb247XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGN1cnJlbnRXZWF0aGVyQVBJQ2FsbChsYXRpdHVkZSwgbG9uZ2l0dWRlKSB7XG4gIGNvbnNvbGUubG9nKGBMYXQ6JHtsYXRpdHVkZX0gLCBMb246ICR7bG9uZ2l0dWRlfWApO1xuICBjb25zdCBtZXRyaWNPckltcGVyaWFsID0gZ2V0VW5pdHMoKTtcbiAgY29uc3QgY3VycmVudFdlYXRoZXJSZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvd2VhdGhlcj9sYXQ9JHtsYXRpdHVkZX0mbG9uPSR7bG9uZ2l0dWRlfSZ1bml0cz0ke21ldHJpY09ySW1wZXJpYWx9JmFwcGlkPTM4NGMzM2ExZjdlZmQ5NzQzMDBjYWNkZjY0OTE3OGQzYCwgeyBtb2RlOiAnY29ycycgfSk7XG4gIGNvbnN0IGN1cnJlbnRXZWF0aGVySnNvbiA9IGF3YWl0IGN1cnJlbnRXZWF0aGVyUmVzcG9uc2UuanNvbigpO1xuICByZXR1cm4gY3VycmVudFdlYXRoZXJKc29uO1xufVxuXG5hc3luYyBmdW5jdGlvbiBob3VybHlXZWF0aGVyQVBJQ2FsbChsYXRpdHVkZSwgbG9uZ2l0dWRlKSB7XG4gIGNvbnN0IG1ldHJpY09ySW1wZXJpYWwgPSBnZXRVbml0cygpO1xuICBjb25zdCB3ZWF0aGVyUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L2ZvcmVjYXN0P2xhdD0ke2xhdGl0dWRlfSZsb249JHtsb25naXR1ZGV9JnVuaXRzPSR7bWV0cmljT3JJbXBlcmlhbH0mYXBwaWQ9Mzg0YzMzYTFmN2VmZDk3NDMwMGNhY2RmNjQ5MTc4ZDNgLCB7IG1vZGU6ICdjb3JzJyB9KTtcbiAgY29uc3Qgd2VhdGhlckpzb24gPSBhd2FpdCB3ZWF0aGVyUmVzcG9uc2UuanNvbigpO1xuICByZXR1cm4gd2VhdGhlckpzb247XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEN1cnJlbnRXZWF0aGVyKCkge1xuICBsZXQgY3VycmVudFdlYXRoZXJKc29uO1xuICB0cnkge1xuICAgIGNvbnN0IGpzb24gPSBhd2FpdCBnZW9sb2NhdGVBUElDYWxsKCk7XG4gICAgaWYgKGpzb24ubGVuZ3RoID4gMCkge1xuICAgICAgY3VycmVudFdlYXRoZXJKc29uID0gYXdhaXQgY3VycmVudFdlYXRoZXJBUElDYWxsKGpzb25bMF0ubGF0LCBqc29uWzBdLmxvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2FuXFwndCBmaW5kIGxvY2F0aW9uIHdpdGggdGhhdCBuYW1lJyk7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgYWxlcnQoZXJyKTtcbiAgfVxuICBpZiAoY3VycmVudFdlYXRoZXJKc29uKSB7XG4gICAgY29uc3Qgd2VhdGhlck9iaiA9IGNyZWF0ZVdlYXRoZXJPYmplY3QoY3VycmVudFdlYXRoZXJKc29uKTtcbiAgICB3ZWF0aGVyT2JqLmNpdHkgPSBjdXJyZW50V2VhdGhlckpzb24ubmFtZTtcbiAgICByZXR1cm4gd2VhdGhlck9iajtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRIb3VybHlXZWF0aGVyKCkge1xuICBsZXQgaG91cmx5V2VhdGhlckpzb247XG4gIHRyeSB7XG4gICAgY29uc3QganNvbiA9IGF3YWl0IGdlb2xvY2F0ZUFQSUNhbGwoKTtcbiAgICBpZiAoanNvbi5sZW5ndGggPiAwKSB7XG4gICAgICBob3VybHlXZWF0aGVySnNvbiA9IGF3YWl0IGhvdXJseVdlYXRoZXJBUElDYWxsKGpzb25bMF0ubGF0LCBqc29uWzBdLmxvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2FuXFwndCBmaW5kIGxvY2F0aW9uIHdpdGggdGhhdCBuYW1lJyk7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgYWxlcnQoZXJyKTtcbiAgfVxuXG4gIGlmIChob3VybHlXZWF0aGVySnNvbikge1xuICAgIGNvbnN0IGhvdXJseVdlYXRoZXJMaXN0ID0gW107XG4gICAgY29uc29sZS5sb2coaG91cmx5V2VhdGhlckpzb24pO1xuICAgIGNvbnN0IHdlYXRoZXJMaXN0ID0gaG91cmx5V2VhdGhlckpzb24ubGlzdDtcbiAgICB3ZWF0aGVyTGlzdC5mb3JFYWNoKChob3VybHlXZWF0aGVyKSA9PiB7XG4gICAgICBjb25zdCB3ZWF0aGVyT2JqID0gY3JlYXRlV2VhdGhlck9iamVjdChob3VybHlXZWF0aGVyKTtcbiAgICAgIHdlYXRoZXJPYmouZGF0ZSA9IGhvdXJseVdlYXRoZXIuZHRfdHh0O1xuICAgICAgaG91cmx5V2VhdGhlckxpc3QucHVzaCh3ZWF0aGVyT2JqKTtcbiAgICB9KTtcbiAgICByZXR1cm4gaG91cmx5V2VhdGhlckxpc3Q7XG4gIH1cbn1cblxuZXhwb3J0IHtcbiAgZ2VvbG9jYXRlQVBJQ2FsbCwgY3VycmVudFdlYXRoZXJBUElDYWxsLCBnZXRDdXJyZW50V2VhdGhlciwgZ2V0SG91cmx5V2VhdGhlcixcbn07XG4iLCJpbXBvcnQgc2V0V2VhdGhlckljb24gZnJvbSAnLi93ZWF0aGVySWNvbkhhbmRsZXInO1xuXG5mdW5jdGlvbiBkaXNwbGF5Q3VycmVudFdlYXRoZXIod2VhdGhlck9iaikge1xuICBjb25zdCB3ZWF0aGVyQ2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53ZWF0aGVyLWNhcmQnKTtcbiAgY29uc3QgY2l0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjaXR5Jyk7XG4gIGNvbnN0IGljb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaWNvbicpO1xuICBjb25zdCB3ZWF0aGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dlYXRoZXInKTtcbiAgY29uc3QgdGVtcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0ZW1wJyk7XG4gIGNvbnN0IHRlbXBGZWVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RlbXBGZWVsJyk7XG4gIGNvbnN0IGh1bWlkaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2h1bWlkaXR5Jyk7XG4gIGNvbnN0IHdpbmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd2luZCcpO1xuICBjb25zdCB3aW5kRGVnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dpbmREZWcnKTtcbiAgY29uc3QgY2hlY2tib3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVncmVlJyk7XG4gIGxldCBjZWxPckZhciA9ICdcXHUyMTAzJztcbiAgbGV0IG1pbGVzUGhPck1ldGVyUGggPSAnbS9oJztcbiAgaWYgKGNoZWNrYm94LmNoZWNrZWQpIHtcbiAgICBjZWxPckZhciA9ICdcXHUyMTA5JztcbiAgICBtaWxlc1BoT3JNZXRlclBoID0gJ21waCc7XG4gIH1cbiAgY2l0eS50ZXh0Q29udGVudCA9IHdlYXRoZXJPYmoubmFtZTtcblxuICBpY29uLnNyYyA9IHNldFdlYXRoZXJJY29uKHdlYXRoZXJPYmouaWNvbik7XG4gIHdlYXRoZXIudGV4dENvbnRlbnQgPSB3ZWF0aGVyT2JqLndlYXRoZXI7XG4gIHRlbXAudGV4dENvbnRlbnQgPSBgVGVtcGVyYXR1cmU6ICR7d2VhdGhlck9iai50ZW1wZXJhdHVyZX0gJHtjZWxPckZhcn1gO1xuICB0ZW1wRmVlbC50ZXh0Q29udGVudCA9IGBGZWVscyBMaWtlOiAke3dlYXRoZXJPYmoudGVtcGVyYXR1cmVGZWVsfSAke2NlbE9yRmFyfWA7XG4gIGh1bWlkaXR5LnRleHRDb250ZW50ID0gYEh1bWlkaXR5OiAke3dlYXRoZXJPYmouaHVtaWRpdHl9JWA7XG4gIHdpbmQudGV4dENvbnRlbnQgPSBgV2luZCBTcGVlZDogJHt3ZWF0aGVyT2JqLndpbmRTcGVlZH0ke21pbGVzUGhPck1ldGVyUGh9YDtcbiAgd2luZERlZy50ZXh0Q29udGVudCA9IGBXaW5kIERlZ3JlZTogJHt3ZWF0aGVyT2JqLndpbmREZWdyZWV9XFx1MDBCMGA7XG5cbiAgd2VhdGhlckNhcmQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbn1cblxuZnVuY3Rpb24gZGlzcGxheUhvdXJseVdlYXRoZXIoaG91cmx5V2VhdGhlckxpc3QpIHtcbiAgY29uc3QgdGFibGVCb2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvZHktdGFibGUnKTtcbiAgaG91cmx5V2VhdGhlckxpc3QuZm9yRWFjaCgod2VhdGhlck9iaikgPT4ge1xuICAgIGNvbnN0IHRhYmxlUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcbiAgICBjb25zdCB0ZFRpbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGNvbnN0IHRkSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgY29uc3QgdGRUZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBjb25zdCB0ZFdlYXRoZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGNvbnN0IHRkRmVlbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGNvbnN0IHRkV2luZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgY29uc3QgdGRIdW1pZGl0eSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgY29uc3QgdGRJY29uSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cbiAgICB0ZFRpbWUudGV4dENvbnRlbnQgPSB3ZWF0aGVyT2JqLmRhdGU7XG4gICAgdGRJY29uSW1nLnNyYyA9IHNldFdlYXRoZXJJY29uKHdlYXRoZXJPYmouaWNvbik7XG4gICAgdGRUZW1wLnRleHRDb250ZW50ID0gd2VhdGhlck9iai50ZW1wZXJhdHVyZTtcbiAgICB0ZFdlYXRoZXIudGV4dENvbnRlbnQgPSB3ZWF0aGVyT2JqLndlYXRoZXI7XG4gICAgdGRGZWVscy50ZXh0Q29udGVudCA9IHdlYXRoZXJPYmoudGVtcGVyYXR1cmVGZWVsO1xuICAgIHRkV2luZC50ZXh0Q29udGVudCA9IHdlYXRoZXJPYmoud2luZFNwZWVkO1xuICAgIHRkSHVtaWRpdHkudGV4dENvbnRlbnQgPSBgJHt3ZWF0aGVyT2JqLmh1bWlkaXR5fSVgO1xuICAgIHRkSWNvbi5hcHBlbmRDaGlsZCh0ZEljb25JbWcpO1xuICAgIHRhYmxlUm93LmFwcGVuZCh0ZFRpbWUsIHRkSWNvbiwgdGRUZW1wLCB0ZFdlYXRoZXIsIHRkRmVlbHMsIHRkV2luZCwgdGRIdW1pZGl0eSk7XG4gICAgdGFibGVCb2R5LmFwcGVuZENoaWxkKHRhYmxlUm93KTtcbiAgfSk7XG59XG5cbmV4cG9ydCB7IGRpc3BsYXlDdXJyZW50V2VhdGhlciwgZGlzcGxheUhvdXJseVdlYXRoZXIgfTtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNldFdlYXRoZXJJY29uKGljb24pIHtcbiAgcmV0dXJuIGBodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93bi8ke2ljb259QDJ4LnBuZ2A7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAqIGFzIHdlYXRoZXJBcGkgZnJvbSAnLi9qcy9hcGlGdW5jdGlvbnMnO1xuaW1wb3J0ICogYXMgZG9tTWFuaXB1bGF0aW9uIGZyb20gJy4vanMvZG9tTWFuaXB1bGF0aW9uJztcblxuY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2NhdGlvbkZvcm0nKTtcblxuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZXZlbnQpID0+IHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgY29uc3QgaW5wdXRCb3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbG9jYXRpb24nKTtcbiAgaWYgKGlucHV0Qm94LnZhbHVlID09PSAnJykgeyByZXR1cm47IH0gLy8gU2V0IEVycm9yIGhhbmRsaW5nXG4gIHdlYXRoZXJBcGkuZ2V0Q3VycmVudFdlYXRoZXIoKVxuICAgIC50aGVuKChvYmopID0+IHtcbiAgICAgIGRvbU1hbmlwdWxhdGlvbi5kaXNwbGF5Q3VycmVudFdlYXRoZXIob2JqKTtcbiAgICB9KTtcbiAgd2VhdGhlckFwaS5nZXRIb3VybHlXZWF0aGVyKClcbiAgICAudGhlbigob2JqKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhvYmopO1xuICAgICAgZG9tTWFuaXB1bGF0aW9uLmRpc3BsYXlIb3VybHlXZWF0aGVyKG9iaik7XG4gICAgfSk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==