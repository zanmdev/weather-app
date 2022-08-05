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
/* harmony import */ var _asset_clear_jpg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../asset/clear.jpg */ "./src/asset/clear.jpg");



function setBackgroundImage(id) {
  const main = document.querySelector('main');
  main.style.backgroundImage = `url(${_asset_clear_jpg__WEBPACK_IMPORTED_MODULE_1__})`;
  console.log('test');
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


/***/ }),

/***/ "./src/asset/clear.jpg":
/*!*****************************!*\
  !*** ./src/asset/clear.jpg ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/clear.jpg";

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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUVBLEVBQUUsOERBQTJCO0FBQzdCO0FBQ0EsY0FBYyxNQUFNO0FBQ3BCLGNBQWMsTUFBTTtBQUNwQixvQ0FBb0MsK0RBQTRCO0FBQ2hFLG1DQUFtQyw4REFBMkI7QUFDOUQ7QUFDQSxLQUFLO0FBQ0w7QUFDQSxNQUFNLHNFQUFxQztBQUMzQyxNQUFNLHFFQUFvQztBQUMxQyxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2pzL2FwaUZ1bmN0aW9ucy5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9qcy9kb21NYW5pcHVsYXRpb24uanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvanMvd2VhdGhlckltYWdlSGFuZGxlci5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gZ2V0VW5pdHMoKSB7XG4gIC8vIENoZWNrIHRoZSBjaGVja2JveCBzdGF0dXMgdG8gc2V0IHdoYXQgdW5pdHMgb2YgbWVhc3VyZW1lbnQgdG8gdXNlXG4gIGNvbnN0IHsgY2hlY2tlZCB9ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlZ3JlZScpO1xuICBsZXQgbWV0cmljT3JJbXBlcmlhbCA9ICdtZXRyaWMnO1xuICBpZiAoY2hlY2tlZCkge1xuICAgIG1ldHJpY09ySW1wZXJpYWwgPSAnaW1wZXJpYWwnO1xuICB9XG4gIHJldHVybiBtZXRyaWNPckltcGVyaWFsO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVXZWF0aGVyT2JqZWN0KGN1cnJlbnRXZWF0aGVySnNvbikge1xuICAvLyBQYXNzIGRhdGEgZnJvbSB0aGUgd2VhdGhlciBBUEkgaW50byBvYmplY3RzIHRvIGJlIHVzZWQgaW4gRE9NIG1hbmlwdWxhdGlvblxuICBjb25zdCBmZWVsTGlrZSA9IGN1cnJlbnRXZWF0aGVySnNvbi5tYWluLmZlZWxzX2xpa2U7XG4gIGNvbnN0IHsgdGVtcCB9ID0gY3VycmVudFdlYXRoZXJKc29uLm1haW47XG4gIGNvbnN0IGh1bWlkID0gY3VycmVudFdlYXRoZXJKc29uLm1haW4uaHVtaWRpdHk7XG4gIGNvbnN0IHRlbXBNYXggPSBjdXJyZW50V2VhdGhlckpzb24ubWFpbi50ZW1wX21heDtcbiAgY29uc3QgdGVtcE1pbiA9IGN1cnJlbnRXZWF0aGVySnNvbi5tYWluLnRlbXBfbWluO1xuXG4gIGNvbnN0IHdlYXRoZXJTdGF0ZSA9IGN1cnJlbnRXZWF0aGVySnNvbi53ZWF0aGVyWzBdLm1haW47XG4gIGNvbnN0IHdlYXRoZXJJZCA9IGN1cnJlbnRXZWF0aGVySnNvbi53ZWF0aGVyWzBdLmlkO1xuICBjb25zdCBpY29uSWQgPSBjdXJyZW50V2VhdGhlckpzb24ud2VhdGhlclswXS5pY29uO1xuXG4gIGNvbnN0IHdpbmRNUFMgPSBjdXJyZW50V2VhdGhlckpzb24ud2luZC5zcGVlZDtcbiAgY29uc3Qgd2luZERlZyA9IGN1cnJlbnRXZWF0aGVySnNvbi53aW5kLmRlZztcblxuICBjb25zdCB3ZWF0aGVyT2JqID0ge1xuICAgIHRlbXBlcmF0dXJlOiB0ZW1wLFxuICAgIHRlbXBlcmF0dXJlRmVlbDogZmVlbExpa2UsXG4gICAgdGVtcGVyYXR1cmVNYXg6IHRlbXBNYXgsXG4gICAgdGVtcGVyYXR1cmVNaW46IHRlbXBNaW4sXG4gICAgaHVtaWRpdHk6IGh1bWlkLFxuICAgIHdlYXRoZXI6IHdlYXRoZXJTdGF0ZSxcbiAgICBpZDogd2VhdGhlcklkLFxuICAgIGljb246IGljb25JZCxcbiAgICB3aW5kU3BlZWQ6IHdpbmRNUFMsXG4gICAgd2luZERlZ3JlZTogd2luZERlZyxcbiAgfTtcbiAgcmV0dXJuIHdlYXRoZXJPYmo7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdlb2xvY2F0ZUFQSUNhbGwoKSB7XG4gIC8vIENhbGwgdGhlIGdlb2xvY2F0ZSBBUEkgZnVuY3Rpb24gdG8gZ2V0IHRoZSBMYXRpdHVkZSBhbmQgTG9uZ2l0dWRlXG5cbiAgY29uc3QgbG9jYXRpb25JbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2NhdGlvbicpLnZhbHVlO1xuICBjb25zdCBnZW9SZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9nZW8vMS4wL2RpcmVjdD9xPSR7bG9jYXRpb25JbnB1dH0mbGltaXQ9MSZhcHBpZD0zODRjMzNhMWY3ZWZkOTc0MzAwY2FjZGY2NDkxNzhkM2AsIHsgbW9kZTogJ2NvcnMnIH0pO1xuXG4gIGNvbnN0IGdlb0pzb24gPSBhd2FpdCBnZW9SZXNwb25zZS5qc29uKCk7XG5cbiAgaWYgKGdlb0pzb24ubGVuZ3RoID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5cXCd0IGZpbmQgdGhlIGxhdGl0dWRlIGFuZCBsb25naXR1ZGUgb2YgdGhhdCBsb2NhdGlvbicpO1xuICB9XG4gIHJldHVybiBnZW9Kc29uO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjdXJyZW50V2VhdGhlckFQSUNhbGwobGF0aXR1ZGUsIGxvbmdpdHVkZSkge1xuICAvLyBDYWxsIHRoZSB3ZWF0aGVyIEFQSSBhbmQgZ2V0IHRoZSBjdXJyZW50IHdlYXRoZXIuXG4gIGNvbnN0IG1ldHJpY09ySW1wZXJpYWwgPSBnZXRVbml0cygpO1xuICBjb25zdCBjdXJyZW50V2VhdGhlclJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP2xhdD0ke2xhdGl0dWRlfSZsb249JHtsb25naXR1ZGV9JnVuaXRzPSR7bWV0cmljT3JJbXBlcmlhbH0mYXBwaWQ9Mzg0YzMzYTFmN2VmZDk3NDMwMGNhY2RmNjQ5MTc4ZDNgLCB7IG1vZGU6ICdjb3JzJyB9KTtcbiAgY29uc3QgY3VycmVudFdlYXRoZXJKc29uID0gYXdhaXQgY3VycmVudFdlYXRoZXJSZXNwb25zZS5qc29uKCk7XG4gIHJldHVybiBjdXJyZW50V2VhdGhlckpzb247XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGhvdXJseVdlYXRoZXJBUElDYWxsKGxhdGl0dWRlLCBsb25naXR1ZGUpIHtcbiAgLy8gQ2FsbCB0aGUgd2VhdGhlciBBUEkgdG8gZ2V0IHRoZSBuZXh0IDQgZGF5cyB3ZWF0aGVyIGluIGhvdXIgZm9ybWF0XG4gIGNvbnN0IG1ldHJpY09ySW1wZXJpYWwgPSBnZXRVbml0cygpO1xuICBjb25zdCB3ZWF0aGVyUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L2ZvcmVjYXN0P2xhdD0ke2xhdGl0dWRlfSZsb249JHtsb25naXR1ZGV9JnVuaXRzPSR7bWV0cmljT3JJbXBlcmlhbH0mYXBwaWQ9Mzg0YzMzYTFmN2VmZDk3NDMwMGNhY2RmNjQ5MTc4ZDNgLCB7IG1vZGU6ICdjb3JzJyB9KTtcbiAgY29uc3Qgd2VhdGhlckpzb24gPSBhd2FpdCB3ZWF0aGVyUmVzcG9uc2UuanNvbigpO1xuICByZXR1cm4gd2VhdGhlckpzb247XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEN1cnJlbnRXZWF0aGVyKGxhdGl0dWRlLCBsb25naXR1ZGUpIHtcbiAgY29uc3QgY3VycmVudFdlYXRoZXJKc29uID0gYXdhaXQgY3VycmVudFdlYXRoZXJBUElDYWxsKGxhdGl0dWRlLCBsb25naXR1ZGUpO1xuXG4gIGlmIChjdXJyZW50V2VhdGhlckpzb24pIHtcbiAgICBjb25zdCB3ZWF0aGVyT2JqID0gY3JlYXRlV2VhdGhlck9iamVjdChjdXJyZW50V2VhdGhlckpzb24pO1xuICAgIHdlYXRoZXJPYmouY2l0eSA9IGN1cnJlbnRXZWF0aGVySnNvbi5uYW1lO1xuICAgIHJldHVybiB3ZWF0aGVyT2JqO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEhvdXJseVdlYXRoZXIobGF0aXR1ZGUsIGxvbmdpdHVkZSkge1xuICBjb25zdCBob3VybHlXZWF0aGVySnNvbiA9IGF3YWl0IGhvdXJseVdlYXRoZXJBUElDYWxsKGxhdGl0dWRlLCBsb25naXR1ZGUpO1xuXG4gIGlmIChob3VybHlXZWF0aGVySnNvbikge1xuICAgIGNvbnN0IGhvdXJseVdlYXRoZXJMaXN0ID0gW107XG4gICAgY29uc3Qgd2VhdGhlckxpc3QgPSBob3VybHlXZWF0aGVySnNvbi5saXN0O1xuICAgIHdlYXRoZXJMaXN0LmZvckVhY2goKGhvdXJseVdlYXRoZXIpID0+IHtcbiAgICAgIGNvbnN0IHdlYXRoZXJPYmogPSBjcmVhdGVXZWF0aGVyT2JqZWN0KGhvdXJseVdlYXRoZXIpO1xuICAgICAgd2VhdGhlck9iai5kYXRlID0gaG91cmx5V2VhdGhlci5kdF90eHQ7XG4gICAgICBob3VybHlXZWF0aGVyTGlzdC5wdXNoKHdlYXRoZXJPYmopO1xuICAgIH0pO1xuICAgIHJldHVybiBob3VybHlXZWF0aGVyTGlzdDtcbiAgfVxufVxuXG5leHBvcnQge1xuICBnZW9sb2NhdGVBUElDYWxsLCBjdXJyZW50V2VhdGhlckFQSUNhbGwsIGdldEN1cnJlbnRXZWF0aGVyLCBnZXRIb3VybHlXZWF0aGVyLFxufTtcbiIsImltcG9ydCBzZXRXZWF0aGVySWNvbiBmcm9tICcuL3dlYXRoZXJJbWFnZUhhbmRsZXInO1xuaW1wb3J0IGNsZWFyIGZyb20gJy4uL2Fzc2V0L2NsZWFyLmpwZyc7XG5cbmZ1bmN0aW9uIHNldEJhY2tncm91bmRJbWFnZShpZCkge1xuICBjb25zdCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpO1xuICBtYWluLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJHtjbGVhcn0pYDtcbiAgY29uc29sZS5sb2coJ3Rlc3QnKTtcbn1cblxuZnVuY3Rpb24gZGlzcGxheUN1cnJlbnRXZWF0aGVyKHdlYXRoZXJPYmopIHtcbiAgY29uc3Qgd2VhdGhlckNhcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2VhdGhlci1jYXJkJyk7XG4gIGNvbnN0IGNpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2l0eScpO1xuICBjb25zdCBpY29uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2ljb24nKTtcbiAgY29uc3Qgd2VhdGhlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3ZWF0aGVyJyk7XG4gIGNvbnN0IHRlbXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdGVtcCcpO1xuICBjb25zdCB0ZW1wRmVlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0ZW1wRmVlbCcpO1xuICBjb25zdCBodW1pZGl0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNodW1pZGl0eScpO1xuICBjb25zdCB3aW5kID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dpbmQnKTtcbiAgY29uc3Qgd2luZERlZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3aW5kRGVnJyk7XG4gIGNvbnN0IGNoZWNrYm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlZ3JlZScpO1xuICBsZXQgY2VsT3JGYXIgPSAnXFx1MjEwMyc7XG4gIGxldCBtaWxlc1BoT3JNZXRlclBoID0gJ20vaCc7XG4gIGlmIChjaGVja2JveC5jaGVja2VkKSB7XG4gICAgY2VsT3JGYXIgPSAnXFx1MjEwOSc7XG4gICAgbWlsZXNQaE9yTWV0ZXJQaCA9ICdtcGgnO1xuICB9XG4gIHNldEJhY2tncm91bmRJbWFnZSh3ZWF0aGVyT2JqLmlkKTtcbiAgY2l0eS50ZXh0Q29udGVudCA9IHdlYXRoZXJPYmouY2l0eTtcblxuICBpY29uLnNyYyA9IHNldFdlYXRoZXJJY29uKHdlYXRoZXJPYmouaWNvbik7XG4gIHdlYXRoZXIudGV4dENvbnRlbnQgPSB3ZWF0aGVyT2JqLndlYXRoZXI7XG4gIHRlbXAudGV4dENvbnRlbnQgPSBgVGVtcGVyYXR1cmU6ICR7d2VhdGhlck9iai50ZW1wZXJhdHVyZX0gJHtjZWxPckZhcn1gO1xuICB0ZW1wRmVlbC50ZXh0Q29udGVudCA9IGBGZWVscyBMaWtlOiAke3dlYXRoZXJPYmoudGVtcGVyYXR1cmVGZWVsfSAke2NlbE9yRmFyfWA7XG4gIGh1bWlkaXR5LnRleHRDb250ZW50ID0gYEh1bWlkaXR5OiAke3dlYXRoZXJPYmouaHVtaWRpdHl9JWA7XG4gIHdpbmQudGV4dENvbnRlbnQgPSBgV2luZCBTcGVlZDogJHt3ZWF0aGVyT2JqLndpbmRTcGVlZH0ke21pbGVzUGhPck1ldGVyUGh9YDtcbiAgd2luZERlZy50ZXh0Q29udGVudCA9IGBXaW5kIERlZ3JlZTogJHt3ZWF0aGVyT2JqLndpbmREZWdyZWV9XFx1MDBCMGA7XG5cbiAgd2VhdGhlckNhcmQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbn1cblxuZnVuY3Rpb24gZGlzcGxheUhvdXJseVdlYXRoZXIoaG91cmx5V2VhdGhlckxpc3QpIHtcbiAgY29uc3QgdGFibGVDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaG91cmx5LXdlYXRoZXInKTtcbiAgY29uc3QgdGFibGVCb2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhYmxlLWJvZHknKTtcbiAgY29uc3QgY2hlY2tib3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVncmVlJyk7XG5cbiAgdGFibGVCb2R5LmlubmVySFRNTCA9ICcnO1xuICBsZXQgY2VsT3JGYXIgPSAnXFx1MjEwMyc7XG4gIGxldCBtaWxlc1BoT3JNZXRlclBoID0gJ20vaCc7XG4gIGlmIChjaGVja2JveC5jaGVja2VkKSB7XG4gICAgY2VsT3JGYXIgPSAnXFx1MjEwOSc7XG4gICAgbWlsZXNQaE9yTWV0ZXJQaCA9ICdtcGgnO1xuICB9XG5cbiAgaG91cmx5V2VhdGhlckxpc3QuZm9yRWFjaCgod2VhdGhlck9iaikgPT4ge1xuICAgIGNvbnN0IHRhYmxlUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcbiAgICBjb25zdCB0ZFRpbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGNvbnN0IHRkSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgY29uc3QgdGRUZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBjb25zdCB0ZFdlYXRoZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGNvbnN0IHRkRmVlbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGNvbnN0IHRkV2luZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgY29uc3QgdGRIdW1pZGl0eSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgY29uc3QgdGRJY29uSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHdlYXRoZXJPYmouZGF0ZSkudG9Mb2NhbGVTdHJpbmcoJ2RlZmF1bHQnLCB7XG4gICAgICB3ZWVrZGF5OiAnc2hvcnQnLCBtb250aDogJ3Nob3J0JywgZGF5OiAnMi1kaWdpdCcsIGhvdXI6ICcyLWRpZ2l0JywgbWludXRlOiAnMi1kaWdpdCcsXG4gICAgfSk7XG5cbiAgICB0ZFRpbWUudGV4dENvbnRlbnQgPSBkYXRlO1xuICAgIHRkSWNvbkltZy5zcmMgPSBzZXRXZWF0aGVySWNvbih3ZWF0aGVyT2JqLmljb24pO1xuICAgIHRkVGVtcC50ZXh0Q29udGVudCA9IGAke3dlYXRoZXJPYmoudGVtcGVyYXR1cmV9ICR7Y2VsT3JGYXJ9YDtcbiAgICB0ZFdlYXRoZXIudGV4dENvbnRlbnQgPSB3ZWF0aGVyT2JqLndlYXRoZXI7XG4gICAgdGRGZWVscy50ZXh0Q29udGVudCA9IGAke3dlYXRoZXJPYmoudGVtcGVyYXR1cmVGZWVsfSAke2NlbE9yRmFyfWA7XG4gICAgdGRXaW5kLnRleHRDb250ZW50ID0gYCR7d2VhdGhlck9iai53aW5kU3BlZWR9JHttaWxlc1BoT3JNZXRlclBofWA7XG4gICAgdGRIdW1pZGl0eS50ZXh0Q29udGVudCA9IGAke3dlYXRoZXJPYmouaHVtaWRpdHl9JWA7XG4gICAgdGRJY29uLmFwcGVuZENoaWxkKHRkSWNvbkltZyk7XG4gICAgdGFibGVSb3cuYXBwZW5kKHRkVGltZSwgdGRJY29uLCB0ZFRlbXAsIHRkV2VhdGhlciwgdGRGZWVscywgdGRXaW5kLCB0ZEh1bWlkaXR5KTtcbiAgICB0YWJsZUJvZHkuYXBwZW5kQ2hpbGQodGFibGVSb3cpO1xuXG4gICAgdGFibGVDb250YWluZXIuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICB0ZEljb25JbWcuY2xhc3NMaXN0LmFkZCgndGFibGUtaWNvbicpO1xuICB9KTtcbn1cblxuZXhwb3J0IHsgZGlzcGxheUN1cnJlbnRXZWF0aGVyLCBkaXNwbGF5SG91cmx5V2VhdGhlciB9O1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2V0V2VhdGhlckljb24oaWNvbikge1xuICByZXR1cm4gYGh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3duLyR7aWNvbn1AMngucG5nYDtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmNcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSBzY3JpcHRVcmwgPSBzY3JpcHRzW3NjcmlwdHMubGVuZ3RoIC0gMV0uc3JjXG5cdH1cbn1cbi8vIFdoZW4gc3VwcG9ydGluZyBicm93c2VycyB3aGVyZSBhbiBhdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIHlvdSBtdXN0IHNwZWNpZnkgYW4gb3V0cHV0LnB1YmxpY1BhdGggbWFudWFsbHkgdmlhIGNvbmZpZ3VyYXRpb25cbi8vIG9yIHBhc3MgYW4gZW1wdHkgc3RyaW5nIChcIlwiKSBhbmQgc2V0IHRoZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB2YXJpYWJsZSBmcm9tIHlvdXIgY29kZSB0byB1c2UgeW91ciBvd24gbG9naWMuXG5pZiAoIXNjcmlwdFVybCkgdGhyb3cgbmV3IEVycm9yKFwiQXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7XG5zY3JpcHRVcmwgPSBzY3JpcHRVcmwucmVwbGFjZSgvIy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcL1teXFwvXSskLywgXCIvXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gc2NyaXB0VXJsOyIsImltcG9ydCAqIGFzIHdlYXRoZXJBcGkgZnJvbSAnLi9qcy9hcGlGdW5jdGlvbnMnO1xuaW1wb3J0ICogYXMgZG9tTWFuaXB1bGF0aW9uIGZyb20gJy4vanMvZG9tTWFuaXB1bGF0aW9uJztcblxuY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2NhdGlvbkZvcm0nKTtcbmNvbnN0IGNoZWNrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlZ3JlZScpO1xuY2hlY2suY2hlY2tlZCA9IGZhbHNlO1xuXG5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChldmVudCkgPT4ge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBjb25zdCBpbnB1dEJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2NhdGlvbicpO1xuICBpZiAoaW5wdXRCb3gudmFsdWUgPT09ICcnKSB7XG4gICAgaW5wdXRCb3guY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaW5wdXRCb3guY2xhc3NMaXN0LnJlbW92ZSgnZXJyb3InKTtcblxuICB3ZWF0aGVyQXBpLmdlb2xvY2F0ZUFQSUNhbGwoKVxuICAgIC50aGVuKChqc29uKSA9PiB7XG4gICAgICBjb25zdCB7IGxhdCB9ID0ganNvblswXTtcbiAgICAgIGNvbnN0IHsgbG9uIH0gPSBqc29uWzBdO1xuICAgICAgY29uc3QgY3VycmVudFdlYXRoZXJQcm9taXNlID0gd2VhdGhlckFwaS5nZXRDdXJyZW50V2VhdGhlcihsYXQsIGxvbik7XG4gICAgICBjb25zdCBob3VybHlXZWF0aGVyUHJvbWlzZSA9IHdlYXRoZXJBcGkuZ2V0SG91cmx5V2VhdGhlcihsYXQsIGxvbik7XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW2N1cnJlbnRXZWF0aGVyUHJvbWlzZSwgaG91cmx5V2VhdGhlclByb21pc2VdKTtcbiAgICB9KVxuICAgIC50aGVuKCh3ZWF0aGVyT2JqZWN0cykgPT4ge1xuICAgICAgZG9tTWFuaXB1bGF0aW9uLmRpc3BsYXlDdXJyZW50V2VhdGhlcih3ZWF0aGVyT2JqZWN0c1swXSk7XG4gICAgICBkb21NYW5pcHVsYXRpb24uZGlzcGxheUhvdXJseVdlYXRoZXIod2VhdGhlck9iamVjdHNbMV0pO1xuICAgIH0pXG4gICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIGFsZXJ0KGVycik7XG4gICAgfSk7XG59KTtcblxuY2hlY2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xhYmVsJyk7XG4gIGNvbnNvbGUubG9nKCd0ZXN0Jyk7XG4gIGlmIChjaGVjay5jaGVja2VkKSB7XG4gICAgbGFiZWwudGV4dENvbnRlbnQgPSAnXFx1MjEwOSc7XG4gIH0gZWxzZSB7XG4gICAgbGFiZWwudGV4dENvbnRlbnQgPSAnXFx1MjEwMyc7XG4gIH1cbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9