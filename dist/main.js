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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1dDUEQ7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7Ozs7Ozs7Ozs7O0FDZmdEO0FBQ1E7O0FBRXhEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsOERBQTZCO0FBQy9COztBQUVBLEVBQUUsOERBQTJCO0FBQzdCO0FBQ0EsY0FBYyxNQUFNO0FBQ3BCLGNBQWMsTUFBTTtBQUNwQixvQ0FBb0MsK0RBQTRCO0FBQ2hFLG1DQUFtQyw4REFBMkI7QUFDOUQ7QUFDQSxLQUFLO0FBQ0w7QUFDQSxNQUFNLHNFQUFxQztBQUMzQyxNQUFNLHFFQUFvQztBQUMxQyxNQUFNLDhEQUE2QjtBQUNuQyxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsTUFBTSw4REFBNkI7QUFDbkMsS0FBSztBQUNMLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2pzL2FwaUZ1bmN0aW9ucy5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9qcy9kb21NYW5pcHVsYXRpb24uanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvanMvd2VhdGhlckltYWdlSGFuZGxlci5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gZ2V0VW5pdHMoKSB7XG4gIC8vIENoZWNrIHRoZSBjaGVja2JveCBzdGF0dXMgdG8gc2V0IHdoYXQgdW5pdHMgb2YgbWVhc3VyZW1lbnQgdG8gdXNlXG4gIGNvbnN0IHsgY2hlY2tlZCB9ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlZ3JlZScpO1xuICBsZXQgbWV0cmljT3JJbXBlcmlhbCA9ICdtZXRyaWMnO1xuICBpZiAoY2hlY2tlZCkge1xuICAgIG1ldHJpY09ySW1wZXJpYWwgPSAnaW1wZXJpYWwnO1xuICB9XG4gIHJldHVybiBtZXRyaWNPckltcGVyaWFsO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVXZWF0aGVyT2JqZWN0KGN1cnJlbnRXZWF0aGVySnNvbikge1xuICAvLyBQYXNzIGRhdGEgZnJvbSB0aGUgd2VhdGhlciBBUEkgaW50byBvYmplY3RzIHRvIGJlIHVzZWQgaW4gRE9NIG1hbmlwdWxhdGlvblxuICBjb25zdCBmZWVsTGlrZSA9IGN1cnJlbnRXZWF0aGVySnNvbi5tYWluLmZlZWxzX2xpa2U7XG4gIGNvbnN0IHsgdGVtcCB9ID0gY3VycmVudFdlYXRoZXJKc29uLm1haW47XG4gIGNvbnN0IGh1bWlkID0gY3VycmVudFdlYXRoZXJKc29uLm1haW4uaHVtaWRpdHk7XG4gIGNvbnN0IHRlbXBNYXggPSBjdXJyZW50V2VhdGhlckpzb24ubWFpbi50ZW1wX21heDtcbiAgY29uc3QgdGVtcE1pbiA9IGN1cnJlbnRXZWF0aGVySnNvbi5tYWluLnRlbXBfbWluO1xuXG4gIGNvbnN0IHdlYXRoZXJTdGF0ZSA9IGN1cnJlbnRXZWF0aGVySnNvbi53ZWF0aGVyWzBdLm1haW47XG4gIGNvbnN0IHdlYXRoZXJJZCA9IGN1cnJlbnRXZWF0aGVySnNvbi53ZWF0aGVyWzBdLmlkO1xuICBjb25zdCBpY29uSWQgPSBjdXJyZW50V2VhdGhlckpzb24ud2VhdGhlclswXS5pY29uO1xuXG4gIGNvbnN0IHdpbmRNUFMgPSBjdXJyZW50V2VhdGhlckpzb24ud2luZC5zcGVlZDtcbiAgY29uc3Qgd2luZERlZyA9IGN1cnJlbnRXZWF0aGVySnNvbi53aW5kLmRlZztcblxuICBjb25zdCB3ZWF0aGVyT2JqID0ge1xuICAgIHRlbXBlcmF0dXJlOiB0ZW1wLFxuICAgIHRlbXBlcmF0dXJlRmVlbDogZmVlbExpa2UsXG4gICAgdGVtcGVyYXR1cmVNYXg6IHRlbXBNYXgsXG4gICAgdGVtcGVyYXR1cmVNaW46IHRlbXBNaW4sXG4gICAgaHVtaWRpdHk6IGh1bWlkLFxuICAgIHdlYXRoZXI6IHdlYXRoZXJTdGF0ZSxcbiAgICBpZDogd2VhdGhlcklkLFxuICAgIGljb246IGljb25JZCxcbiAgICB3aW5kU3BlZWQ6IHdpbmRNUFMsXG4gICAgd2luZERlZ3JlZTogd2luZERlZyxcbiAgfTtcbiAgcmV0dXJuIHdlYXRoZXJPYmo7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdlb2xvY2F0ZUFQSUNhbGwoKSB7XG4gIC8vIENhbGwgdGhlIGdlb2xvY2F0ZSBBUEkgZnVuY3Rpb24gdG8gZ2V0IHRoZSBMYXRpdHVkZSBhbmQgTG9uZ2l0dWRlXG5cbiAgY29uc3QgbG9jYXRpb25JbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2NhdGlvbicpLnZhbHVlO1xuICBjb25zdCBnZW9SZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9nZW8vMS4wL2RpcmVjdD9xPSR7bG9jYXRpb25JbnB1dH0mbGltaXQ9MSZhcHBpZD0zODRjMzNhMWY3ZWZkOTc0MzAwY2FjZGY2NDkxNzhkM2AsIHsgbW9kZTogJ2NvcnMnIH0pO1xuXG4gIGNvbnN0IGdlb0pzb24gPSBhd2FpdCBnZW9SZXNwb25zZS5qc29uKCk7XG5cbiAgaWYgKGdlb0pzb24ubGVuZ3RoID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5cXCd0IGZpbmQgdGhlIGxhdGl0dWRlIGFuZCBsb25naXR1ZGUgb2YgdGhhdCBsb2NhdGlvbicpO1xuICB9XG4gIHJldHVybiBnZW9Kc29uO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjdXJyZW50V2VhdGhlckFQSUNhbGwobGF0aXR1ZGUsIGxvbmdpdHVkZSkge1xuICAvLyBDYWxsIHRoZSB3ZWF0aGVyIEFQSSBhbmQgZ2V0IHRoZSBjdXJyZW50IHdlYXRoZXIuXG4gIGNvbnN0IG1ldHJpY09ySW1wZXJpYWwgPSBnZXRVbml0cygpO1xuICBjb25zdCBjdXJyZW50V2VhdGhlclJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP2xhdD0ke2xhdGl0dWRlfSZsb249JHtsb25naXR1ZGV9JnVuaXRzPSR7bWV0cmljT3JJbXBlcmlhbH0mYXBwaWQ9Mzg0YzMzYTFmN2VmZDk3NDMwMGNhY2RmNjQ5MTc4ZDNgLCB7IG1vZGU6ICdjb3JzJyB9KTtcbiAgY29uc3QgY3VycmVudFdlYXRoZXJKc29uID0gYXdhaXQgY3VycmVudFdlYXRoZXJSZXNwb25zZS5qc29uKCk7XG4gIHJldHVybiBjdXJyZW50V2VhdGhlckpzb247XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGhvdXJseVdlYXRoZXJBUElDYWxsKGxhdGl0dWRlLCBsb25naXR1ZGUpIHtcbiAgLy8gQ2FsbCB0aGUgd2VhdGhlciBBUEkgdG8gZ2V0IHRoZSBuZXh0IDQgZGF5cyB3ZWF0aGVyIGluIGhvdXIgZm9ybWF0XG4gIGNvbnN0IG1ldHJpY09ySW1wZXJpYWwgPSBnZXRVbml0cygpO1xuICBjb25zdCB3ZWF0aGVyUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L2ZvcmVjYXN0P2xhdD0ke2xhdGl0dWRlfSZsb249JHtsb25naXR1ZGV9JnVuaXRzPSR7bWV0cmljT3JJbXBlcmlhbH0mYXBwaWQ9Mzg0YzMzYTFmN2VmZDk3NDMwMGNhY2RmNjQ5MTc4ZDNgLCB7IG1vZGU6ICdjb3JzJyB9KTtcbiAgY29uc3Qgd2VhdGhlckpzb24gPSBhd2FpdCB3ZWF0aGVyUmVzcG9uc2UuanNvbigpO1xuICByZXR1cm4gd2VhdGhlckpzb247XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEN1cnJlbnRXZWF0aGVyKGxhdGl0dWRlLCBsb25naXR1ZGUpIHtcbiAgY29uc3QgY3VycmVudFdlYXRoZXJKc29uID0gYXdhaXQgY3VycmVudFdlYXRoZXJBUElDYWxsKGxhdGl0dWRlLCBsb25naXR1ZGUpO1xuXG4gIGlmIChjdXJyZW50V2VhdGhlckpzb24pIHtcbiAgICBjb25zdCB3ZWF0aGVyT2JqID0gY3JlYXRlV2VhdGhlck9iamVjdChjdXJyZW50V2VhdGhlckpzb24pO1xuICAgIHdlYXRoZXJPYmouY2l0eSA9IGN1cnJlbnRXZWF0aGVySnNvbi5uYW1lO1xuICAgIHJldHVybiB3ZWF0aGVyT2JqO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEhvdXJseVdlYXRoZXIobGF0aXR1ZGUsIGxvbmdpdHVkZSkge1xuICBjb25zdCBob3VybHlXZWF0aGVySnNvbiA9IGF3YWl0IGhvdXJseVdlYXRoZXJBUElDYWxsKGxhdGl0dWRlLCBsb25naXR1ZGUpO1xuXG4gIGlmIChob3VybHlXZWF0aGVySnNvbikge1xuICAgIGNvbnN0IGhvdXJseVdlYXRoZXJMaXN0ID0gW107XG4gICAgY29uc3Qgd2VhdGhlckxpc3QgPSBob3VybHlXZWF0aGVySnNvbi5saXN0O1xuICAgIHdlYXRoZXJMaXN0LmZvckVhY2goKGhvdXJseVdlYXRoZXIpID0+IHtcbiAgICAgIGNvbnN0IHdlYXRoZXJPYmogPSBjcmVhdGVXZWF0aGVyT2JqZWN0KGhvdXJseVdlYXRoZXIpO1xuICAgICAgd2VhdGhlck9iai5kYXRlID0gaG91cmx5V2VhdGhlci5kdF90eHQ7XG4gICAgICBob3VybHlXZWF0aGVyTGlzdC5wdXNoKHdlYXRoZXJPYmopO1xuICAgIH0pO1xuICAgIHJldHVybiBob3VybHlXZWF0aGVyTGlzdDtcbiAgfVxufVxuXG5leHBvcnQge1xuICBnZW9sb2NhdGVBUElDYWxsLCBjdXJyZW50V2VhdGhlckFQSUNhbGwsIGdldEN1cnJlbnRXZWF0aGVyLCBnZXRIb3VybHlXZWF0aGVyLFxufTtcbiIsImltcG9ydCAqIGFzIHdlYXRoZXJJbWFnZUhhbmRsZXIgZnJvbSAnLi93ZWF0aGVySW1hZ2VIYW5kbGVyJztcblxuZnVuY3Rpb24gZGlzcGxheUN1cnJlbnRXZWF0aGVyKHdlYXRoZXJPYmopIHtcbiAgY29uc3Qgd2VhdGhlckNhcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2VhdGhlci1jYXJkJyk7XG4gIGNvbnN0IGNpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2l0eScpO1xuICBjb25zdCBpY29uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2ljb24nKTtcbiAgY29uc3Qgd2VhdGhlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3ZWF0aGVyJyk7XG4gIGNvbnN0IHRlbXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdGVtcCcpO1xuICBjb25zdCB0ZW1wRmVlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0ZW1wRmVlbCcpO1xuICBjb25zdCBodW1pZGl0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNodW1pZGl0eScpO1xuICBjb25zdCB3aW5kID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dpbmQnKTtcbiAgY29uc3Qgd2luZERlZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3aW5kRGVnJyk7XG4gIGNvbnN0IGNoZWNrYm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlZ3JlZScpO1xuICBsZXQgY2VsT3JGYXIgPSAnXFx1MjEwMyc7XG4gIGxldCBtaWxlc1BoT3JNZXRlclBoID0gJ20vaCc7XG4gIGlmIChjaGVja2JveC5jaGVja2VkKSB7XG4gICAgY2VsT3JGYXIgPSAnXFx1MjEwOSc7XG4gICAgbWlsZXNQaE9yTWV0ZXJQaCA9ICdtcGgnO1xuICB9XG4gIGNvbnN0IGJhY2tncm91bmRJZCA9IHdlYXRoZXJPYmouaWNvbi5zcGxpdCgnJykuc3BsaWNlKDAsIDIpLmpvaW4oJycpO1xuICBjb25zb2xlLmxvZyhiYWNrZ3JvdW5kSWQpO1xuICB3ZWF0aGVySW1hZ2VIYW5kbGVyLnNldEJhY2tncm91bmRJbWFnZShiYWNrZ3JvdW5kSWQpO1xuICBjaXR5LnRleHRDb250ZW50ID0gd2VhdGhlck9iai5jaXR5O1xuXG4gIGljb24uc3JjID0gd2VhdGhlckltYWdlSGFuZGxlci5zZXRXZWF0aGVySWNvbih3ZWF0aGVyT2JqLmljb24pO1xuICB3ZWF0aGVyLnRleHRDb250ZW50ID0gd2VhdGhlck9iai53ZWF0aGVyO1xuICB0ZW1wLnRleHRDb250ZW50ID0gYFRlbXBlcmF0dXJlOiAke3dlYXRoZXJPYmoudGVtcGVyYXR1cmV9ICR7Y2VsT3JGYXJ9YDtcbiAgdGVtcEZlZWwudGV4dENvbnRlbnQgPSBgRmVlbHMgTGlrZTogJHt3ZWF0aGVyT2JqLnRlbXBlcmF0dXJlRmVlbH0gJHtjZWxPckZhcn1gO1xuICBodW1pZGl0eS50ZXh0Q29udGVudCA9IGBIdW1pZGl0eTogJHt3ZWF0aGVyT2JqLmh1bWlkaXR5fSVgO1xuICB3aW5kLnRleHRDb250ZW50ID0gYFdpbmQgU3BlZWQ6ICR7d2VhdGhlck9iai53aW5kU3BlZWR9JHttaWxlc1BoT3JNZXRlclBofWA7XG4gIHdpbmREZWcudGV4dENvbnRlbnQgPSBgV2luZCBEZWdyZWU6ICR7d2VhdGhlck9iai53aW5kRGVncmVlfVxcdTAwQjBgO1xuXG4gIHdlYXRoZXJDYXJkLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlIb3VybHlXZWF0aGVyKGhvdXJseVdlYXRoZXJMaXN0KSB7XG4gIGNvbnN0IHRhYmxlQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhvdXJseS13ZWF0aGVyJyk7XG4gIGNvbnN0IHRhYmxlQm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YWJsZS1ib2R5Jyk7XG4gIGNvbnN0IGNoZWNrYm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlZ3JlZScpO1xuXG4gIHRhYmxlQm9keS5pbm5lckhUTUwgPSAnJztcbiAgbGV0IGNlbE9yRmFyID0gJ1xcdTIxMDMnO1xuICBsZXQgbWlsZXNQaE9yTWV0ZXJQaCA9ICdtL2gnO1xuICBpZiAoY2hlY2tib3guY2hlY2tlZCkge1xuICAgIGNlbE9yRmFyID0gJ1xcdTIxMDknO1xuICAgIG1pbGVzUGhPck1ldGVyUGggPSAnbXBoJztcbiAgfVxuICBob3VybHlXZWF0aGVyTGlzdC5mb3JFYWNoKCh3ZWF0aGVyT2JqKSA9PiB7XG4gICAgY29uc3QgdGFibGVSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xuICAgIGNvbnN0IHRkVGltZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgY29uc3QgdGRJY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBjb25zdCB0ZFRlbXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGNvbnN0IHRkV2VhdGhlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgY29uc3QgdGRGZWVscyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgY29uc3QgdGRXaW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBjb25zdCB0ZEh1bWlkaXR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBjb25zdCB0ZEljb25JbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUod2VhdGhlck9iai5kYXRlKS50b0xvY2FsZVN0cmluZygnZGVmYXVsdCcsIHtcbiAgICAgIHdlZWtkYXk6ICdzaG9ydCcsIG1vbnRoOiAnc2hvcnQnLCBkYXk6ICcyLWRpZ2l0JywgaG91cjogJzItZGlnaXQnLCBtaW51dGU6ICcyLWRpZ2l0JyxcbiAgICB9KTtcblxuICAgIHRkVGltZS50ZXh0Q29udGVudCA9IGRhdGU7XG4gICAgdGRJY29uSW1nLnNyYyA9IHdlYXRoZXJJbWFnZUhhbmRsZXIuc2V0V2VhdGhlckljb24od2VhdGhlck9iai5pY29uKTtcbiAgICB0ZFRlbXAudGV4dENvbnRlbnQgPSBgJHt3ZWF0aGVyT2JqLnRlbXBlcmF0dXJlfSAke2NlbE9yRmFyfWA7XG4gICAgdGRXZWF0aGVyLnRleHRDb250ZW50ID0gd2VhdGhlck9iai53ZWF0aGVyO1xuICAgIHRkRmVlbHMudGV4dENvbnRlbnQgPSBgJHt3ZWF0aGVyT2JqLnRlbXBlcmF0dXJlRmVlbH0gJHtjZWxPckZhcn1gO1xuICAgIHRkV2luZC50ZXh0Q29udGVudCA9IGAke3dlYXRoZXJPYmoud2luZFNwZWVkfSR7bWlsZXNQaE9yTWV0ZXJQaH1gO1xuICAgIHRkSHVtaWRpdHkudGV4dENvbnRlbnQgPSBgJHt3ZWF0aGVyT2JqLmh1bWlkaXR5fSVgO1xuICAgIHRkSWNvbi5hcHBlbmRDaGlsZCh0ZEljb25JbWcpO1xuICAgIHRhYmxlUm93LmFwcGVuZCh0ZFRpbWUsIHRkSWNvbiwgdGRUZW1wLCB0ZFdlYXRoZXIsIHRkRmVlbHMsIHRkV2luZCwgdGRIdW1pZGl0eSk7XG4gICAgdGFibGVCb2R5LmFwcGVuZENoaWxkKHRhYmxlUm93KTtcblxuICAgIHRhYmxlQ29udGFpbmVyLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgdGRJY29uSW1nLmNsYXNzTGlzdC5hZGQoJ3RhYmxlLWljb24nKTtcbiAgfSk7XG59XG5mdW5jdGlvbiB0b2dnbGVMb2FkaW5nKHN0YXJ0KSB7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsJyk7XG4gIGNvbnN0IGxvYWRpbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyJyk7XG4gIGlmIChzdGFydCkge1xuICAgIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIGxvYWRpbmcuc3R5bGUuYW5pbWF0aW9uUGxheVN0YXRlID0gJ3J1bm5pbmcnO1xuICB9IGVsc2UgaWYgKCFzdGFydCkge1xuICAgIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgbG9hZGluZy5zdHlsZS5hbmltYXRpb25QbGF5U3RhdGUgPSAncGF1c2VkJztcbiAgfVxufVxuXG5leHBvcnQgeyBkaXNwbGF5Q3VycmVudFdlYXRoZXIsIGRpc3BsYXlIb3VybHlXZWF0aGVyLCB0b2dnbGVMb2FkaW5nIH07XG4iLCJpbXBvcnQgY2xlYXIgZnJvbSAnLi4vYXNzZXQvY2xlYXIuanBnJztcbmltcG9ydCBmZXdDbG91ZHMgZnJvbSAnLi4vYXNzZXQvZmV3Q2xvdWRzLmpwZyc7XG5pbXBvcnQgc2NhdHRlcmVkQ2xvdWQgZnJvbSAnLi4vYXNzZXQvc2NhdHRlcmRDbG91ZHMuanBnJztcbmltcG9ydCBicm9rZW5DbG91ZCBmcm9tICcuLi9hc3NldC9icm9rZW5DbG91ZHMuanBnJztcbmltcG9ydCBsaWdodFJhaW4gZnJvbSAnLi4vYXNzZXQvbGlnaHRSYWluLmpwZyc7XG5pbXBvcnQgcmFpbiBmcm9tICcuLi9hc3NldC9yYWluLmpwZyc7XG5pbXBvcnQgdGh1bmRlciBmcm9tICcuLi9hc3NldC90aHVuZGVyLmpwZyc7XG5pbXBvcnQgc25vdyBmcm9tICcuLi9hc3NldC9zbm93LmpwZyc7XG5pbXBvcnQgbWlzdCBmcm9tICcuLi9hc3NldC9taXN0LmpwZyc7XG5cbmNvbnN0IGltYWdlcyA9IHtcbiAgJzAxJzogY2xlYXIsXG4gICcwMic6IGZld0Nsb3VkcyxcbiAgJzAzJzogc2NhdHRlcmVkQ2xvdWQsXG4gICcwNCc6IGJyb2tlbkNsb3VkLFxuICAnMDknOiBsaWdodFJhaW4sXG4gIDEwOiByYWluLFxuICAxMTogdGh1bmRlcixcbiAgMTM6IHNub3csXG4gIDUwOiBtaXN0LFxufTtcblxuZnVuY3Rpb24gc2V0V2VhdGhlckljb24oaWNvbikge1xuICByZXR1cm4gYGh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3duLyR7aWNvbn1AMngucG5nYDtcbn1cblxuZnVuY3Rpb24gc2V0QmFja2dyb3VuZEltYWdlKGlkKSB7XG4gIGNvbnNvbGUubG9nKGltYWdlc1tpZF0pO1xuICBjb25zdCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpO1xuICBtYWluLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJHtpbWFnZXNbaWRdfSlgO1xufVxuXG5leHBvcnQgeyBzZXRXZWF0aGVySWNvbiwgc2V0QmFja2dyb3VuZEltYWdlIH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjXG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkgc2NyaXB0VXJsID0gc2NyaXB0c1tzY3JpcHRzLmxlbmd0aCAtIDFdLnNyY1xuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJpbXBvcnQgKiBhcyB3ZWF0aGVyQXBpIGZyb20gJy4vanMvYXBpRnVuY3Rpb25zJztcbmltcG9ydCAqIGFzIGRvbU1hbmlwdWxhdGlvbiBmcm9tICcuL2pzL2RvbU1hbmlwdWxhdGlvbic7XG5cbmNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbG9jYXRpb25Gb3JtJyk7XG5jb25zdCBjaGVjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZWdyZWUnKTtcbmNoZWNrLmNoZWNrZWQgPSBmYWxzZTtcblxuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZXZlbnQpID0+IHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgY29uc3QgaW5wdXRCb3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbG9jYXRpb24nKTtcbiAgaWYgKGlucHV0Qm94LnZhbHVlID09PSAnJykge1xuICAgIGlucHV0Qm94LmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGRvbU1hbmlwdWxhdGlvbi50b2dnbGVMb2FkaW5nKHRydWUpO1xuICBpbnB1dEJveC5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvcicpO1xuXG4gIHdlYXRoZXJBcGkuZ2VvbG9jYXRlQVBJQ2FsbCgpXG4gICAgLnRoZW4oKGpzb24pID0+IHtcbiAgICAgIGNvbnN0IHsgbGF0IH0gPSBqc29uWzBdO1xuICAgICAgY29uc3QgeyBsb24gfSA9IGpzb25bMF07XG4gICAgICBjb25zdCBjdXJyZW50V2VhdGhlclByb21pc2UgPSB3ZWF0aGVyQXBpLmdldEN1cnJlbnRXZWF0aGVyKGxhdCwgbG9uKTtcbiAgICAgIGNvbnN0IGhvdXJseVdlYXRoZXJQcm9taXNlID0gd2VhdGhlckFwaS5nZXRIb3VybHlXZWF0aGVyKGxhdCwgbG9uKTtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChbY3VycmVudFdlYXRoZXJQcm9taXNlLCBob3VybHlXZWF0aGVyUHJvbWlzZV0pO1xuICAgIH0pXG4gICAgLnRoZW4oKHdlYXRoZXJPYmplY3RzKSA9PiB7XG4gICAgICBkb21NYW5pcHVsYXRpb24uZGlzcGxheUN1cnJlbnRXZWF0aGVyKHdlYXRoZXJPYmplY3RzWzBdKTtcbiAgICAgIGRvbU1hbmlwdWxhdGlvbi5kaXNwbGF5SG91cmx5V2VhdGhlcih3ZWF0aGVyT2JqZWN0c1sxXSk7XG4gICAgICBkb21NYW5pcHVsYXRpb24udG9nZ2xlTG9hZGluZyhmYWxzZSk7XG4gICAgfSlcbiAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgYWxlcnQoZXJyKTtcbiAgICAgIGRvbU1hbmlwdWxhdGlvbi50b2dnbGVMb2FkaW5nKGZhbHNlKTtcbiAgICB9KTtcbn0pO1xuXG5jaGVjay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbGFiZWwnKTtcbiAgY29uc29sZS5sb2coJ3Rlc3QnKTtcbiAgaWYgKGNoZWNrLmNoZWNrZWQpIHtcbiAgICBsYWJlbC50ZXh0Q29udGVudCA9ICdcXHUyMTA5JztcbiAgfSBlbHNlIHtcbiAgICBsYWJlbC50ZXh0Q29udGVudCA9ICdcXHUyMTAzJztcbiAgfVxufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=