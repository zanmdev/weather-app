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
  const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${locationInput}&limit=1&appid=384c33a1f7efd974300cacdf649178d3`, { mode: 'cors' });

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
/* harmony export */   "displayHourlyWeather": () => (/* binding */ displayHourlyWeather),
/* harmony export */   "toggleLoading": () => (/* binding */ toggleLoading)
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
  let celOrFar = '\u2103';
  let milesPhOrMeterPh = 'm/h';
  if (checkbox.checked) {
    celOrFar = '\u2109';
    milesPhOrMeterPh = 'mph';
  }
  const backgroundId = weatherObj.icon.split('').splice(0, 2).join('');
  console.log(backgroundId);
  _weatherImageHandler__WEBPACK_IMPORTED_MODULE_0__.setBackgroundImage(backgroundId);
  city.textContent = weatherObj.city;

  icon.src = _weatherImageHandler__WEBPACK_IMPORTED_MODULE_0__.setWeatherIcon(weatherObj.icon);
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
    tdIconImg.src = _weatherImageHandler__WEBPACK_IMPORTED_MODULE_0__.setWeatherIcon(weatherObj.icon);
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
function toggleLoading(start) {
  const modal = document.querySelector('.modal');
  const loading = document.querySelector('.loader');
  if (start) {
    modal.style.display = 'block';
    loading.style.animationPlayState = 'running';
  } else if (!start) {
    modal.style.display = 'none';
    loading.style.animationPlayState = 'paused';
  }
}




/***/ }),

/***/ "./src/js/weatherImageHandler.js":
/*!***************************************!*\
  !*** ./src/js/weatherImageHandler.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "setBackgroundImage": () => (/* binding */ setBackgroundImage),
/* harmony export */   "setWeatherIcon": () => (/* binding */ setWeatherIcon)
/* harmony export */ });
/* harmony import */ var _asset_clear_jpg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../asset/clear.jpg */ "./src/asset/clear.jpg");
/* harmony import */ var _asset_fewClouds_jpg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../asset/fewClouds.jpg */ "./src/asset/fewClouds.jpg");
/* harmony import */ var _asset_scatterdClouds_jpg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../asset/scatterdClouds.jpg */ "./src/asset/scatterdClouds.jpg");
/* harmony import */ var _asset_brokenClouds_jpg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../asset/brokenClouds.jpg */ "./src/asset/brokenClouds.jpg");
/* harmony import */ var _asset_lightRain_jpg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../asset/lightRain.jpg */ "./src/asset/lightRain.jpg");
/* harmony import */ var _asset_rain_jpg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../asset/rain.jpg */ "./src/asset/rain.jpg");
/* harmony import */ var _asset_thunder_jpg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../asset/thunder.jpg */ "./src/asset/thunder.jpg");
/* harmony import */ var _asset_snow_jpg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../asset/snow.jpg */ "./src/asset/snow.jpg");
/* harmony import */ var _asset_mist_jpg__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../asset/mist.jpg */ "./src/asset/mist.jpg");










const images = {
  '01': _asset_clear_jpg__WEBPACK_IMPORTED_MODULE_0__,
  '02': _asset_fewClouds_jpg__WEBPACK_IMPORTED_MODULE_1__,
  '03': _asset_scatterdClouds_jpg__WEBPACK_IMPORTED_MODULE_2__,
  '04': _asset_brokenClouds_jpg__WEBPACK_IMPORTED_MODULE_3__,
  '09': _asset_lightRain_jpg__WEBPACK_IMPORTED_MODULE_4__,
  10: _asset_rain_jpg__WEBPACK_IMPORTED_MODULE_5__,
  11: _asset_thunder_jpg__WEBPACK_IMPORTED_MODULE_6__,
  13: _asset_snow_jpg__WEBPACK_IMPORTED_MODULE_7__,
  50: _asset_mist_jpg__WEBPACK_IMPORTED_MODULE_8__,
};

function setWeatherIcon(icon) {
  return `http://openweathermap.org/img/wn/${icon}@2x.png`;
}

function setBackgroundImage(id) {
  console.log(images[id]);
  const main = document.querySelector('main');
  main.style.backgroundImage = `url(${images[id]})`;
}




/***/ }),

/***/ "./src/asset/brokenClouds.jpg":
/*!************************************!*\
  !*** ./src/asset/brokenClouds.jpg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/brokenClouds.jpg";

/***/ }),

/***/ "./src/asset/clear.jpg":
/*!*****************************!*\
  !*** ./src/asset/clear.jpg ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/clear.jpg";

/***/ }),

/***/ "./src/asset/fewClouds.jpg":
/*!*********************************!*\
  !*** ./src/asset/fewClouds.jpg ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/fewClouds.jpg";

/***/ }),

/***/ "./src/asset/lightRain.jpg":
/*!*********************************!*\
  !*** ./src/asset/lightRain.jpg ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/lightRain.jpg";

/***/ }),

/***/ "./src/asset/mist.jpg":
/*!****************************!*\
  !*** ./src/asset/mist.jpg ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/mist.jpg";

/***/ }),

/***/ "./src/asset/rain.jpg":
/*!****************************!*\
  !*** ./src/asset/rain.jpg ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/rain.jpg";

/***/ }),

/***/ "./src/asset/scatterdClouds.jpg":
/*!**************************************!*\
  !*** ./src/asset/scatterdClouds.jpg ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/scatterdClouds.jpg";

/***/ }),

/***/ "./src/asset/snow.jpg":
/*!****************************!*\
  !*** ./src/asset/snow.jpg ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/snow.jpg";

/***/ }),

/***/ "./src/asset/thunder.jpg":
/*!*******************************!*\
  !*** ./src/asset/thunder.jpg ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/thunder.jpg";

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
  _js_domManipulation__WEBPACK_IMPORTED_MODULE_1__.toggleLoading(true);
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
      _js_domManipulation__WEBPACK_IMPORTED_MODULE_1__.toggleLoading(false);
    })
    .catch((err) => {
      console.error(err);
      alert(err);
      _js_domManipulation__WEBPACK_IMPORTED_MODULE_1__.toggleLoading(false);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1dDUEQ7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7Ozs7Ozs7Ozs7O0FDZmdEO0FBQ1E7O0FBRXhEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsOERBQTZCO0FBQy9COztBQUVBLEVBQUUsOERBQTJCO0FBQzdCO0FBQ0EsY0FBYyxNQUFNO0FBQ3BCLGNBQWMsTUFBTTtBQUNwQixvQ0FBb0MsK0RBQTRCO0FBQ2hFLG1DQUFtQyw4REFBMkI7QUFDOUQ7QUFDQSxLQUFLO0FBQ0w7QUFDQSxNQUFNLHNFQUFxQztBQUMzQyxNQUFNLHFFQUFvQztBQUMxQyxNQUFNLDhEQUE2QjtBQUNuQyxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsTUFBTSw4REFBNkI7QUFDbkMsS0FBSztBQUNMLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2pzL2FwaUZ1bmN0aW9ucy5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9qcy9kb21NYW5pcHVsYXRpb24uanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvanMvd2VhdGhlckltYWdlSGFuZGxlci5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gZ2V0VW5pdHMoKSB7XG4gIC8vIENoZWNrIHRoZSBjaGVja2JveCBzdGF0dXMgdG8gc2V0IHdoYXQgdW5pdHMgb2YgbWVhc3VyZW1lbnQgdG8gdXNlXG4gIGNvbnN0IHsgY2hlY2tlZCB9ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlZ3JlZScpO1xuICBsZXQgbWV0cmljT3JJbXBlcmlhbCA9ICdtZXRyaWMnO1xuICBpZiAoY2hlY2tlZCkge1xuICAgIG1ldHJpY09ySW1wZXJpYWwgPSAnaW1wZXJpYWwnO1xuICB9XG4gIHJldHVybiBtZXRyaWNPckltcGVyaWFsO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVXZWF0aGVyT2JqZWN0KGN1cnJlbnRXZWF0aGVySnNvbikge1xuICAvLyBQYXNzIGRhdGEgZnJvbSB0aGUgd2VhdGhlciBBUEkgaW50byBvYmplY3RzIHRvIGJlIHVzZWQgaW4gRE9NIG1hbmlwdWxhdGlvblxuICBjb25zdCBmZWVsTGlrZSA9IGN1cnJlbnRXZWF0aGVySnNvbi5tYWluLmZlZWxzX2xpa2U7XG4gIGNvbnN0IHsgdGVtcCB9ID0gY3VycmVudFdlYXRoZXJKc29uLm1haW47XG4gIGNvbnN0IGh1bWlkID0gY3VycmVudFdlYXRoZXJKc29uLm1haW4uaHVtaWRpdHk7XG4gIGNvbnN0IHRlbXBNYXggPSBjdXJyZW50V2VhdGhlckpzb24ubWFpbi50ZW1wX21heDtcbiAgY29uc3QgdGVtcE1pbiA9IGN1cnJlbnRXZWF0aGVySnNvbi5tYWluLnRlbXBfbWluO1xuXG4gIGNvbnN0IHdlYXRoZXJTdGF0ZSA9IGN1cnJlbnRXZWF0aGVySnNvbi53ZWF0aGVyWzBdLm1haW47XG4gIGNvbnN0IHdlYXRoZXJJZCA9IGN1cnJlbnRXZWF0aGVySnNvbi53ZWF0aGVyWzBdLmlkO1xuICBjb25zdCBpY29uSWQgPSBjdXJyZW50V2VhdGhlckpzb24ud2VhdGhlclswXS5pY29uO1xuXG4gIGNvbnN0IHdpbmRNUFMgPSBjdXJyZW50V2VhdGhlckpzb24ud2luZC5zcGVlZDtcbiAgY29uc3Qgd2luZERlZyA9IGN1cnJlbnRXZWF0aGVySnNvbi53aW5kLmRlZztcblxuICBjb25zdCB3ZWF0aGVyT2JqID0ge1xuICAgIHRlbXBlcmF0dXJlOiB0ZW1wLFxuICAgIHRlbXBlcmF0dXJlRmVlbDogZmVlbExpa2UsXG4gICAgdGVtcGVyYXR1cmVNYXg6IHRlbXBNYXgsXG4gICAgdGVtcGVyYXR1cmVNaW46IHRlbXBNaW4sXG4gICAgaHVtaWRpdHk6IGh1bWlkLFxuICAgIHdlYXRoZXI6IHdlYXRoZXJTdGF0ZSxcbiAgICBpZDogd2VhdGhlcklkLFxuICAgIGljb246IGljb25JZCxcbiAgICB3aW5kU3BlZWQ6IHdpbmRNUFMsXG4gICAgd2luZERlZ3JlZTogd2luZERlZyxcbiAgfTtcbiAgcmV0dXJuIHdlYXRoZXJPYmo7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdlb2xvY2F0ZUFQSUNhbGwoKSB7XG4gIC8vIENhbGwgdGhlIGdlb2xvY2F0ZSBBUEkgZnVuY3Rpb24gdG8gZ2V0IHRoZSBMYXRpdHVkZSBhbmQgTG9uZ2l0dWRlXG5cbiAgY29uc3QgbG9jYXRpb25JbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2NhdGlvbicpLnZhbHVlO1xuICBjb25zdCBnZW9SZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZ2VvLzEuMC9kaXJlY3Q/cT0ke2xvY2F0aW9uSW5wdXR9JmxpbWl0PTEmYXBwaWQ9Mzg0YzMzYTFmN2VmZDk3NDMwMGNhY2RmNjQ5MTc4ZDNgLCB7IG1vZGU6ICdjb3JzJyB9KTtcblxuICBjb25zdCBnZW9Kc29uID0gYXdhaXQgZ2VvUmVzcG9uc2UuanNvbigpO1xuXG4gIGlmIChnZW9Kc29uLmxlbmd0aCA9PT0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2FuXFwndCBmaW5kIHRoZSBsYXRpdHVkZSBhbmQgbG9uZ2l0dWRlIG9mIHRoYXQgbG9jYXRpb24nKTtcbiAgfVxuICByZXR1cm4gZ2VvSnNvbjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY3VycmVudFdlYXRoZXJBUElDYWxsKGxhdGl0dWRlLCBsb25naXR1ZGUpIHtcbiAgLy8gQ2FsbCB0aGUgd2VhdGhlciBBUEkgYW5kIGdldCB0aGUgY3VycmVudCB3ZWF0aGVyLlxuICBjb25zdCBtZXRyaWNPckltcGVyaWFsID0gZ2V0VW5pdHMoKTtcbiAgY29uc3QgY3VycmVudFdlYXRoZXJSZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvd2VhdGhlcj9sYXQ9JHtsYXRpdHVkZX0mbG9uPSR7bG9uZ2l0dWRlfSZ1bml0cz0ke21ldHJpY09ySW1wZXJpYWx9JmFwcGlkPTM4NGMzM2ExZjdlZmQ5NzQzMDBjYWNkZjY0OTE3OGQzYCwgeyBtb2RlOiAnY29ycycgfSk7XG4gIGNvbnN0IGN1cnJlbnRXZWF0aGVySnNvbiA9IGF3YWl0IGN1cnJlbnRXZWF0aGVyUmVzcG9uc2UuanNvbigpO1xuICByZXR1cm4gY3VycmVudFdlYXRoZXJKc29uO1xufVxuXG5hc3luYyBmdW5jdGlvbiBob3VybHlXZWF0aGVyQVBJQ2FsbChsYXRpdHVkZSwgbG9uZ2l0dWRlKSB7XG4gIC8vIENhbGwgdGhlIHdlYXRoZXIgQVBJIHRvIGdldCB0aGUgbmV4dCA0IGRheXMgd2VhdGhlciBpbiBob3VyIGZvcm1hdFxuICBjb25zdCBtZXRyaWNPckltcGVyaWFsID0gZ2V0VW5pdHMoKTtcbiAgY29uc3Qgd2VhdGhlclJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS9mb3JlY2FzdD9sYXQ9JHtsYXRpdHVkZX0mbG9uPSR7bG9uZ2l0dWRlfSZ1bml0cz0ke21ldHJpY09ySW1wZXJpYWx9JmFwcGlkPTM4NGMzM2ExZjdlZmQ5NzQzMDBjYWNkZjY0OTE3OGQzYCwgeyBtb2RlOiAnY29ycycgfSk7XG4gIGNvbnN0IHdlYXRoZXJKc29uID0gYXdhaXQgd2VhdGhlclJlc3BvbnNlLmpzb24oKTtcbiAgcmV0dXJuIHdlYXRoZXJKc29uO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRDdXJyZW50V2VhdGhlcihsYXRpdHVkZSwgbG9uZ2l0dWRlKSB7XG4gIGNvbnN0IGN1cnJlbnRXZWF0aGVySnNvbiA9IGF3YWl0IGN1cnJlbnRXZWF0aGVyQVBJQ2FsbChsYXRpdHVkZSwgbG9uZ2l0dWRlKTtcblxuICBpZiAoY3VycmVudFdlYXRoZXJKc29uKSB7XG4gICAgY29uc3Qgd2VhdGhlck9iaiA9IGNyZWF0ZVdlYXRoZXJPYmplY3QoY3VycmVudFdlYXRoZXJKc29uKTtcbiAgICB3ZWF0aGVyT2JqLmNpdHkgPSBjdXJyZW50V2VhdGhlckpzb24ubmFtZTtcbiAgICByZXR1cm4gd2VhdGhlck9iajtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRIb3VybHlXZWF0aGVyKGxhdGl0dWRlLCBsb25naXR1ZGUpIHtcbiAgY29uc3QgaG91cmx5V2VhdGhlckpzb24gPSBhd2FpdCBob3VybHlXZWF0aGVyQVBJQ2FsbChsYXRpdHVkZSwgbG9uZ2l0dWRlKTtcblxuICBpZiAoaG91cmx5V2VhdGhlckpzb24pIHtcbiAgICBjb25zdCBob3VybHlXZWF0aGVyTGlzdCA9IFtdO1xuICAgIGNvbnN0IHdlYXRoZXJMaXN0ID0gaG91cmx5V2VhdGhlckpzb24ubGlzdDtcbiAgICB3ZWF0aGVyTGlzdC5mb3JFYWNoKChob3VybHlXZWF0aGVyKSA9PiB7XG4gICAgICBjb25zdCB3ZWF0aGVyT2JqID0gY3JlYXRlV2VhdGhlck9iamVjdChob3VybHlXZWF0aGVyKTtcbiAgICAgIHdlYXRoZXJPYmouZGF0ZSA9IGhvdXJseVdlYXRoZXIuZHRfdHh0O1xuICAgICAgaG91cmx5V2VhdGhlckxpc3QucHVzaCh3ZWF0aGVyT2JqKTtcbiAgICB9KTtcbiAgICByZXR1cm4gaG91cmx5V2VhdGhlckxpc3Q7XG4gIH1cbn1cblxuZXhwb3J0IHtcbiAgZ2VvbG9jYXRlQVBJQ2FsbCwgY3VycmVudFdlYXRoZXJBUElDYWxsLCBnZXRDdXJyZW50V2VhdGhlciwgZ2V0SG91cmx5V2VhdGhlcixcbn07XG4iLCJpbXBvcnQgKiBhcyB3ZWF0aGVySW1hZ2VIYW5kbGVyIGZyb20gJy4vd2VhdGhlckltYWdlSGFuZGxlcic7XG5cbmZ1bmN0aW9uIGRpc3BsYXlDdXJyZW50V2VhdGhlcih3ZWF0aGVyT2JqKSB7XG4gIGNvbnN0IHdlYXRoZXJDYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndlYXRoZXItY2FyZCcpO1xuICBjb25zdCBjaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NpdHknKTtcbiAgY29uc3QgaWNvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNpY29uJyk7XG4gIGNvbnN0IHdlYXRoZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd2VhdGhlcicpO1xuICBjb25zdCB0ZW1wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RlbXAnKTtcbiAgY29uc3QgdGVtcEZlZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdGVtcEZlZWwnKTtcbiAgY29uc3QgaHVtaWRpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaHVtaWRpdHknKTtcbiAgY29uc3Qgd2luZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3aW5kJyk7XG4gIGNvbnN0IHdpbmREZWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd2luZERlZycpO1xuICBjb25zdCBjaGVja2JveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZWdyZWUnKTtcbiAgbGV0IGNlbE9yRmFyID0gJ1xcdTIxMDMnO1xuICBsZXQgbWlsZXNQaE9yTWV0ZXJQaCA9ICdtL2gnO1xuICBpZiAoY2hlY2tib3guY2hlY2tlZCkge1xuICAgIGNlbE9yRmFyID0gJ1xcdTIxMDknO1xuICAgIG1pbGVzUGhPck1ldGVyUGggPSAnbXBoJztcbiAgfVxuICBjb25zdCBiYWNrZ3JvdW5kSWQgPSB3ZWF0aGVyT2JqLmljb24uc3BsaXQoJycpLnNwbGljZSgwLCAyKS5qb2luKCcnKTtcbiAgY29uc29sZS5sb2coYmFja2dyb3VuZElkKTtcbiAgd2VhdGhlckltYWdlSGFuZGxlci5zZXRCYWNrZ3JvdW5kSW1hZ2UoYmFja2dyb3VuZElkKTtcbiAgY2l0eS50ZXh0Q29udGVudCA9IHdlYXRoZXJPYmouY2l0eTtcblxuICBpY29uLnNyYyA9IHdlYXRoZXJJbWFnZUhhbmRsZXIuc2V0V2VhdGhlckljb24od2VhdGhlck9iai5pY29uKTtcbiAgd2VhdGhlci50ZXh0Q29udGVudCA9IHdlYXRoZXJPYmoud2VhdGhlcjtcbiAgdGVtcC50ZXh0Q29udGVudCA9IGBUZW1wZXJhdHVyZTogJHt3ZWF0aGVyT2JqLnRlbXBlcmF0dXJlfSAke2NlbE9yRmFyfWA7XG4gIHRlbXBGZWVsLnRleHRDb250ZW50ID0gYEZlZWxzIExpa2U6ICR7d2VhdGhlck9iai50ZW1wZXJhdHVyZUZlZWx9ICR7Y2VsT3JGYXJ9YDtcbiAgaHVtaWRpdHkudGV4dENvbnRlbnQgPSBgSHVtaWRpdHk6ICR7d2VhdGhlck9iai5odW1pZGl0eX0lYDtcbiAgd2luZC50ZXh0Q29udGVudCA9IGBXaW5kIFNwZWVkOiAke3dlYXRoZXJPYmoud2luZFNwZWVkfSR7bWlsZXNQaE9yTWV0ZXJQaH1gO1xuICB3aW5kRGVnLnRleHRDb250ZW50ID0gYFdpbmQgRGVncmVlOiAke3dlYXRoZXJPYmoud2luZERlZ3JlZX1cXHUwMEIwYDtcblxuICB3ZWF0aGVyQ2FyZC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xufVxuXG5mdW5jdGlvbiBkaXNwbGF5SG91cmx5V2VhdGhlcihob3VybHlXZWF0aGVyTGlzdCkge1xuICBjb25zdCB0YWJsZUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ob3VybHktd2VhdGhlcicpO1xuICBjb25zdCB0YWJsZUJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFibGUtYm9keScpO1xuICBjb25zdCBjaGVja2JveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZWdyZWUnKTtcblxuICB0YWJsZUJvZHkuaW5uZXJIVE1MID0gJyc7XG4gIGxldCBjZWxPckZhciA9ICdcXHUyMTAzJztcbiAgbGV0IG1pbGVzUGhPck1ldGVyUGggPSAnbS9oJztcbiAgaWYgKGNoZWNrYm94LmNoZWNrZWQpIHtcbiAgICBjZWxPckZhciA9ICdcXHUyMTA5JztcbiAgICBtaWxlc1BoT3JNZXRlclBoID0gJ21waCc7XG4gIH1cbiAgaG91cmx5V2VhdGhlckxpc3QuZm9yRWFjaCgod2VhdGhlck9iaikgPT4ge1xuICAgIGNvbnN0IHRhYmxlUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcbiAgICBjb25zdCB0ZFRpbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGNvbnN0IHRkSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgY29uc3QgdGRUZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBjb25zdCB0ZFdlYXRoZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGNvbnN0IHRkRmVlbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGNvbnN0IHRkV2luZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgY29uc3QgdGRIdW1pZGl0eSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgY29uc3QgdGRJY29uSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHdlYXRoZXJPYmouZGF0ZSkudG9Mb2NhbGVTdHJpbmcoJ2RlZmF1bHQnLCB7XG4gICAgICB3ZWVrZGF5OiAnc2hvcnQnLCBtb250aDogJ3Nob3J0JywgZGF5OiAnMi1kaWdpdCcsIGhvdXI6ICcyLWRpZ2l0JywgbWludXRlOiAnMi1kaWdpdCcsXG4gICAgfSk7XG5cbiAgICB0ZFRpbWUudGV4dENvbnRlbnQgPSBkYXRlO1xuICAgIHRkSWNvbkltZy5zcmMgPSB3ZWF0aGVySW1hZ2VIYW5kbGVyLnNldFdlYXRoZXJJY29uKHdlYXRoZXJPYmouaWNvbik7XG4gICAgdGRUZW1wLnRleHRDb250ZW50ID0gYCR7d2VhdGhlck9iai50ZW1wZXJhdHVyZX0gJHtjZWxPckZhcn1gO1xuICAgIHRkV2VhdGhlci50ZXh0Q29udGVudCA9IHdlYXRoZXJPYmoud2VhdGhlcjtcbiAgICB0ZEZlZWxzLnRleHRDb250ZW50ID0gYCR7d2VhdGhlck9iai50ZW1wZXJhdHVyZUZlZWx9ICR7Y2VsT3JGYXJ9YDtcbiAgICB0ZFdpbmQudGV4dENvbnRlbnQgPSBgJHt3ZWF0aGVyT2JqLndpbmRTcGVlZH0ke21pbGVzUGhPck1ldGVyUGh9YDtcbiAgICB0ZEh1bWlkaXR5LnRleHRDb250ZW50ID0gYCR7d2VhdGhlck9iai5odW1pZGl0eX0lYDtcbiAgICB0ZEljb24uYXBwZW5kQ2hpbGQodGRJY29uSW1nKTtcbiAgICB0YWJsZVJvdy5hcHBlbmQodGRUaW1lLCB0ZEljb24sIHRkVGVtcCwgdGRXZWF0aGVyLCB0ZEZlZWxzLCB0ZFdpbmQsIHRkSHVtaWRpdHkpO1xuICAgIHRhYmxlQm9keS5hcHBlbmRDaGlsZCh0YWJsZVJvdyk7XG5cbiAgICB0YWJsZUNvbnRhaW5lci5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgIHRkSWNvbkltZy5jbGFzc0xpc3QuYWRkKCd0YWJsZS1pY29uJyk7XG4gIH0pO1xufVxuZnVuY3Rpb24gdG9nZ2xlTG9hZGluZyhzdGFydCkge1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbCcpO1xuICBjb25zdCBsb2FkaW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvYWRlcicpO1xuICBpZiAoc3RhcnQpIHtcbiAgICBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICBsb2FkaW5nLnN0eWxlLmFuaW1hdGlvblBsYXlTdGF0ZSA9ICdydW5uaW5nJztcbiAgfSBlbHNlIGlmICghc3RhcnQpIHtcbiAgICBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIGxvYWRpbmcuc3R5bGUuYW5pbWF0aW9uUGxheVN0YXRlID0gJ3BhdXNlZCc7XG4gIH1cbn1cblxuZXhwb3J0IHsgZGlzcGxheUN1cnJlbnRXZWF0aGVyLCBkaXNwbGF5SG91cmx5V2VhdGhlciwgdG9nZ2xlTG9hZGluZyB9O1xuIiwiaW1wb3J0IGNsZWFyIGZyb20gJy4uL2Fzc2V0L2NsZWFyLmpwZyc7XG5pbXBvcnQgZmV3Q2xvdWRzIGZyb20gJy4uL2Fzc2V0L2Zld0Nsb3Vkcy5qcGcnO1xuaW1wb3J0IHNjYXR0ZXJlZENsb3VkIGZyb20gJy4uL2Fzc2V0L3NjYXR0ZXJkQ2xvdWRzLmpwZyc7XG5pbXBvcnQgYnJva2VuQ2xvdWQgZnJvbSAnLi4vYXNzZXQvYnJva2VuQ2xvdWRzLmpwZyc7XG5pbXBvcnQgbGlnaHRSYWluIGZyb20gJy4uL2Fzc2V0L2xpZ2h0UmFpbi5qcGcnO1xuaW1wb3J0IHJhaW4gZnJvbSAnLi4vYXNzZXQvcmFpbi5qcGcnO1xuaW1wb3J0IHRodW5kZXIgZnJvbSAnLi4vYXNzZXQvdGh1bmRlci5qcGcnO1xuaW1wb3J0IHNub3cgZnJvbSAnLi4vYXNzZXQvc25vdy5qcGcnO1xuaW1wb3J0IG1pc3QgZnJvbSAnLi4vYXNzZXQvbWlzdC5qcGcnO1xuXG5jb25zdCBpbWFnZXMgPSB7XG4gICcwMSc6IGNsZWFyLFxuICAnMDInOiBmZXdDbG91ZHMsXG4gICcwMyc6IHNjYXR0ZXJlZENsb3VkLFxuICAnMDQnOiBicm9rZW5DbG91ZCxcbiAgJzA5JzogbGlnaHRSYWluLFxuICAxMDogcmFpbixcbiAgMTE6IHRodW5kZXIsXG4gIDEzOiBzbm93LFxuICA1MDogbWlzdCxcbn07XG5cbmZ1bmN0aW9uIHNldFdlYXRoZXJJY29uKGljb24pIHtcbiAgcmV0dXJuIGBodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93bi8ke2ljb259QDJ4LnBuZ2A7XG59XG5cbmZ1bmN0aW9uIHNldEJhY2tncm91bmRJbWFnZShpZCkge1xuICBjb25zb2xlLmxvZyhpbWFnZXNbaWRdKTtcbiAgY29uc3QgbWFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21haW4nKTtcbiAgbWFpbi5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCR7aW1hZ2VzW2lkXX0pYDtcbn1cblxuZXhwb3J0IHsgc2V0V2VhdGhlckljb24sIHNldEJhY2tncm91bmRJbWFnZSB9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyY1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHNjcmlwdFVybCA9IHNjcmlwdHNbc2NyaXB0cy5sZW5ndGggLSAxXS5zcmNcblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiaW1wb3J0ICogYXMgd2VhdGhlckFwaSBmcm9tICcuL2pzL2FwaUZ1bmN0aW9ucyc7XG5pbXBvcnQgKiBhcyBkb21NYW5pcHVsYXRpb24gZnJvbSAnLi9qcy9kb21NYW5pcHVsYXRpb24nO1xuXG5jb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xvY2F0aW9uRm9ybScpO1xuY29uc3QgY2hlY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVncmVlJyk7XG5jaGVjay5jaGVja2VkID0gZmFsc2U7XG5cbmZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGV2ZW50KSA9PiB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIGNvbnN0IGlucHV0Qm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xvY2F0aW9uJyk7XG4gIGlmIChpbnB1dEJveC52YWx1ZSA9PT0gJycpIHtcbiAgICBpbnB1dEJveC5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xuICAgIHJldHVybjtcbiAgfVxuICBkb21NYW5pcHVsYXRpb24udG9nZ2xlTG9hZGluZyh0cnVlKTtcbiAgaW5wdXRCb3guY2xhc3NMaXN0LnJlbW92ZSgnZXJyb3InKTtcblxuICB3ZWF0aGVyQXBpLmdlb2xvY2F0ZUFQSUNhbGwoKVxuICAgIC50aGVuKChqc29uKSA9PiB7XG4gICAgICBjb25zdCB7IGxhdCB9ID0ganNvblswXTtcbiAgICAgIGNvbnN0IHsgbG9uIH0gPSBqc29uWzBdO1xuICAgICAgY29uc3QgY3VycmVudFdlYXRoZXJQcm9taXNlID0gd2VhdGhlckFwaS5nZXRDdXJyZW50V2VhdGhlcihsYXQsIGxvbik7XG4gICAgICBjb25zdCBob3VybHlXZWF0aGVyUHJvbWlzZSA9IHdlYXRoZXJBcGkuZ2V0SG91cmx5V2VhdGhlcihsYXQsIGxvbik7XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW2N1cnJlbnRXZWF0aGVyUHJvbWlzZSwgaG91cmx5V2VhdGhlclByb21pc2VdKTtcbiAgICB9KVxuICAgIC50aGVuKCh3ZWF0aGVyT2JqZWN0cykgPT4ge1xuICAgICAgZG9tTWFuaXB1bGF0aW9uLmRpc3BsYXlDdXJyZW50V2VhdGhlcih3ZWF0aGVyT2JqZWN0c1swXSk7XG4gICAgICBkb21NYW5pcHVsYXRpb24uZGlzcGxheUhvdXJseVdlYXRoZXIod2VhdGhlck9iamVjdHNbMV0pO1xuICAgICAgZG9tTWFuaXB1bGF0aW9uLnRvZ2dsZUxvYWRpbmcoZmFsc2UpO1xuICAgIH0pXG4gICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIGFsZXJ0KGVycik7XG4gICAgICBkb21NYW5pcHVsYXRpb24udG9nZ2xlTG9hZGluZyhmYWxzZSk7XG4gICAgfSk7XG59KTtcblxuY2hlY2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xhYmVsJyk7XG4gIGNvbnNvbGUubG9nKCd0ZXN0Jyk7XG4gIGlmIChjaGVjay5jaGVja2VkKSB7XG4gICAgbGFiZWwudGV4dENvbnRlbnQgPSAnXFx1MjEwOSc7XG4gIH0gZWxzZSB7XG4gICAgbGFiZWwudGV4dENvbnRlbnQgPSAnXFx1MjEwMyc7XG4gIH1cbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9