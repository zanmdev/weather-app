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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7Ozs7Ozs7Ozs7QUNmZ0Q7QUFDUTs7QUFFeEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsRUFBRSw4REFBMkI7QUFDN0I7QUFDQSxjQUFjLE1BQU07QUFDcEIsY0FBYyxNQUFNO0FBQ3BCLG9DQUFvQywrREFBNEI7QUFDaEUsbUNBQW1DLDhEQUEyQjtBQUM5RDtBQUNBLEtBQUs7QUFDTDtBQUNBLE1BQU0sc0VBQXFDO0FBQzNDLE1BQU0scUVBQW9DO0FBQzFDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvanMvYXBpRnVuY3Rpb25zLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2pzL2RvbU1hbmlwdWxhdGlvbi5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9qcy93ZWF0aGVySW1hZ2VIYW5kbGVyLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBnZXRVbml0cygpIHtcbiAgLy8gQ2hlY2sgdGhlIGNoZWNrYm94IHN0YXR1cyB0byBzZXQgd2hhdCB1bml0cyBvZiBtZWFzdXJlbWVudCB0byB1c2VcbiAgY29uc3QgeyBjaGVja2VkIH0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVncmVlJyk7XG4gIGxldCBtZXRyaWNPckltcGVyaWFsID0gJ21ldHJpYyc7XG4gIGlmIChjaGVja2VkKSB7XG4gICAgbWV0cmljT3JJbXBlcmlhbCA9ICdpbXBlcmlhbCc7XG4gIH1cbiAgcmV0dXJuIG1ldHJpY09ySW1wZXJpYWw7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVdlYXRoZXJPYmplY3QoY3VycmVudFdlYXRoZXJKc29uKSB7XG4gIC8vIFBhc3MgZGF0YSBmcm9tIHRoZSB3ZWF0aGVyIEFQSSBpbnRvIG9iamVjdHMgdG8gYmUgdXNlZCBpbiBET00gbWFuaXB1bGF0aW9uXG4gIGNvbnN0IGZlZWxMaWtlID0gY3VycmVudFdlYXRoZXJKc29uLm1haW4uZmVlbHNfbGlrZTtcbiAgY29uc3QgeyB0ZW1wIH0gPSBjdXJyZW50V2VhdGhlckpzb24ubWFpbjtcbiAgY29uc3QgaHVtaWQgPSBjdXJyZW50V2VhdGhlckpzb24ubWFpbi5odW1pZGl0eTtcbiAgY29uc3QgdGVtcE1heCA9IGN1cnJlbnRXZWF0aGVySnNvbi5tYWluLnRlbXBfbWF4O1xuICBjb25zdCB0ZW1wTWluID0gY3VycmVudFdlYXRoZXJKc29uLm1haW4udGVtcF9taW47XG5cbiAgY29uc3Qgd2VhdGhlclN0YXRlID0gY3VycmVudFdlYXRoZXJKc29uLndlYXRoZXJbMF0ubWFpbjtcbiAgY29uc3Qgd2VhdGhlcklkID0gY3VycmVudFdlYXRoZXJKc29uLndlYXRoZXJbMF0uaWQ7XG4gIGNvbnN0IGljb25JZCA9IGN1cnJlbnRXZWF0aGVySnNvbi53ZWF0aGVyWzBdLmljb247XG5cbiAgY29uc3Qgd2luZE1QUyA9IGN1cnJlbnRXZWF0aGVySnNvbi53aW5kLnNwZWVkO1xuICBjb25zdCB3aW5kRGVnID0gY3VycmVudFdlYXRoZXJKc29uLndpbmQuZGVnO1xuXG4gIGNvbnN0IHdlYXRoZXJPYmogPSB7XG4gICAgdGVtcGVyYXR1cmU6IHRlbXAsXG4gICAgdGVtcGVyYXR1cmVGZWVsOiBmZWVsTGlrZSxcbiAgICB0ZW1wZXJhdHVyZU1heDogdGVtcE1heCxcbiAgICB0ZW1wZXJhdHVyZU1pbjogdGVtcE1pbixcbiAgICBodW1pZGl0eTogaHVtaWQsXG4gICAgd2VhdGhlcjogd2VhdGhlclN0YXRlLFxuICAgIGlkOiB3ZWF0aGVySWQsXG4gICAgaWNvbjogaWNvbklkLFxuICAgIHdpbmRTcGVlZDogd2luZE1QUyxcbiAgICB3aW5kRGVncmVlOiB3aW5kRGVnLFxuICB9O1xuICByZXR1cm4gd2VhdGhlck9iajtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2VvbG9jYXRlQVBJQ2FsbCgpIHtcbiAgLy8gQ2FsbCB0aGUgZ2VvbG9jYXRlIEFQSSBmdW5jdGlvbiB0byBnZXQgdGhlIExhdGl0dWRlIGFuZCBMb25naXR1ZGVcblxuICBjb25zdCBsb2NhdGlvbklucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xvY2F0aW9uJykudmFsdWU7XG4gIGNvbnN0IGdlb1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2dlby8xLjAvZGlyZWN0P3E9JHtsb2NhdGlvbklucHV0fSZsaW1pdD0xJmFwcGlkPTM4NGMzM2ExZjdlZmQ5NzQzMDBjYWNkZjY0OTE3OGQzYCwgeyBtb2RlOiAnY29ycycgfSk7XG5cbiAgY29uc3QgZ2VvSnNvbiA9IGF3YWl0IGdlb1Jlc3BvbnNlLmpzb24oKTtcblxuICBpZiAoZ2VvSnNvbi5sZW5ndGggPT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhblxcJ3QgZmluZCB0aGUgbGF0aXR1ZGUgYW5kIGxvbmdpdHVkZSBvZiB0aGF0IGxvY2F0aW9uJyk7XG4gIH1cbiAgcmV0dXJuIGdlb0pzb247XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGN1cnJlbnRXZWF0aGVyQVBJQ2FsbChsYXRpdHVkZSwgbG9uZ2l0dWRlKSB7XG4gIC8vIENhbGwgdGhlIHdlYXRoZXIgQVBJIGFuZCBnZXQgdGhlIGN1cnJlbnQgd2VhdGhlci5cbiAgY29uc3QgbWV0cmljT3JJbXBlcmlhbCA9IGdldFVuaXRzKCk7XG4gIGNvbnN0IGN1cnJlbnRXZWF0aGVyUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/bGF0PSR7bGF0aXR1ZGV9Jmxvbj0ke2xvbmdpdHVkZX0mdW5pdHM9JHttZXRyaWNPckltcGVyaWFsfSZhcHBpZD0zODRjMzNhMWY3ZWZkOTc0MzAwY2FjZGY2NDkxNzhkM2AsIHsgbW9kZTogJ2NvcnMnIH0pO1xuICBjb25zdCBjdXJyZW50V2VhdGhlckpzb24gPSBhd2FpdCBjdXJyZW50V2VhdGhlclJlc3BvbnNlLmpzb24oKTtcbiAgcmV0dXJuIGN1cnJlbnRXZWF0aGVySnNvbjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaG91cmx5V2VhdGhlckFQSUNhbGwobGF0aXR1ZGUsIGxvbmdpdHVkZSkge1xuICAvLyBDYWxsIHRoZSB3ZWF0aGVyIEFQSSB0byBnZXQgdGhlIG5leHQgNCBkYXlzIHdlYXRoZXIgaW4gaG91ciBmb3JtYXRcbiAgY29uc3QgbWV0cmljT3JJbXBlcmlhbCA9IGdldFVuaXRzKCk7XG4gIGNvbnN0IHdlYXRoZXJSZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvZm9yZWNhc3Q/bGF0PSR7bGF0aXR1ZGV9Jmxvbj0ke2xvbmdpdHVkZX0mdW5pdHM9JHttZXRyaWNPckltcGVyaWFsfSZhcHBpZD0zODRjMzNhMWY3ZWZkOTc0MzAwY2FjZGY2NDkxNzhkM2AsIHsgbW9kZTogJ2NvcnMnIH0pO1xuICBjb25zdCB3ZWF0aGVySnNvbiA9IGF3YWl0IHdlYXRoZXJSZXNwb25zZS5qc29uKCk7XG4gIHJldHVybiB3ZWF0aGVySnNvbjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0Q3VycmVudFdlYXRoZXIobGF0aXR1ZGUsIGxvbmdpdHVkZSkge1xuICBjb25zdCBjdXJyZW50V2VhdGhlckpzb24gPSBhd2FpdCBjdXJyZW50V2VhdGhlckFQSUNhbGwobGF0aXR1ZGUsIGxvbmdpdHVkZSk7XG5cbiAgaWYgKGN1cnJlbnRXZWF0aGVySnNvbikge1xuICAgIGNvbnN0IHdlYXRoZXJPYmogPSBjcmVhdGVXZWF0aGVyT2JqZWN0KGN1cnJlbnRXZWF0aGVySnNvbik7XG4gICAgd2VhdGhlck9iai5jaXR5ID0gY3VycmVudFdlYXRoZXJKc29uLm5hbWU7XG4gICAgcmV0dXJuIHdlYXRoZXJPYmo7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0SG91cmx5V2VhdGhlcihsYXRpdHVkZSwgbG9uZ2l0dWRlKSB7XG4gIGNvbnN0IGhvdXJseVdlYXRoZXJKc29uID0gYXdhaXQgaG91cmx5V2VhdGhlckFQSUNhbGwobGF0aXR1ZGUsIGxvbmdpdHVkZSk7XG5cbiAgaWYgKGhvdXJseVdlYXRoZXJKc29uKSB7XG4gICAgY29uc3QgaG91cmx5V2VhdGhlckxpc3QgPSBbXTtcbiAgICBjb25zdCB3ZWF0aGVyTGlzdCA9IGhvdXJseVdlYXRoZXJKc29uLmxpc3Q7XG4gICAgd2VhdGhlckxpc3QuZm9yRWFjaCgoaG91cmx5V2VhdGhlcikgPT4ge1xuICAgICAgY29uc3Qgd2VhdGhlck9iaiA9IGNyZWF0ZVdlYXRoZXJPYmplY3QoaG91cmx5V2VhdGhlcik7XG4gICAgICB3ZWF0aGVyT2JqLmRhdGUgPSBob3VybHlXZWF0aGVyLmR0X3R4dDtcbiAgICAgIGhvdXJseVdlYXRoZXJMaXN0LnB1c2god2VhdGhlck9iaik7XG4gICAgfSk7XG4gICAgcmV0dXJuIGhvdXJseVdlYXRoZXJMaXN0O1xuICB9XG59XG5cbmV4cG9ydCB7XG4gIGdlb2xvY2F0ZUFQSUNhbGwsIGN1cnJlbnRXZWF0aGVyQVBJQ2FsbCwgZ2V0Q3VycmVudFdlYXRoZXIsIGdldEhvdXJseVdlYXRoZXIsXG59O1xuIiwiaW1wb3J0ICogYXMgd2VhdGhlckltYWdlSGFuZGxlciBmcm9tICcuL3dlYXRoZXJJbWFnZUhhbmRsZXInO1xuXG5mdW5jdGlvbiBkaXNwbGF5Q3VycmVudFdlYXRoZXIod2VhdGhlck9iaikge1xuICBjb25zdCB3ZWF0aGVyQ2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53ZWF0aGVyLWNhcmQnKTtcbiAgY29uc3QgY2l0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjaXR5Jyk7XG4gIGNvbnN0IGljb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaWNvbicpO1xuICBjb25zdCB3ZWF0aGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dlYXRoZXInKTtcbiAgY29uc3QgdGVtcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0ZW1wJyk7XG4gIGNvbnN0IHRlbXBGZWVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RlbXBGZWVsJyk7XG4gIGNvbnN0IGh1bWlkaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2h1bWlkaXR5Jyk7XG4gIGNvbnN0IHdpbmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd2luZCcpO1xuICBjb25zdCB3aW5kRGVnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dpbmREZWcnKTtcbiAgY29uc3QgY2hlY2tib3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVncmVlJyk7XG4gIGxldCBjZWxPckZhciA9ICdcXHUyMTAzJztcbiAgbGV0IG1pbGVzUGhPck1ldGVyUGggPSAnbS9oJztcbiAgaWYgKGNoZWNrYm94LmNoZWNrZWQpIHtcbiAgICBjZWxPckZhciA9ICdcXHUyMTA5JztcbiAgICBtaWxlc1BoT3JNZXRlclBoID0gJ21waCc7XG4gIH1cbiAgY29uc3QgYmFja2dyb3VuZElkID0gd2VhdGhlck9iai5pY29uLnNwbGl0KCcnKS5zcGxpY2UoMCwgMikuam9pbignJyk7XG4gIGNvbnNvbGUubG9nKGJhY2tncm91bmRJZCk7XG4gIHdlYXRoZXJJbWFnZUhhbmRsZXIuc2V0QmFja2dyb3VuZEltYWdlKGJhY2tncm91bmRJZCk7XG4gIGNpdHkudGV4dENvbnRlbnQgPSB3ZWF0aGVyT2JqLmNpdHk7XG5cbiAgaWNvbi5zcmMgPSB3ZWF0aGVySW1hZ2VIYW5kbGVyLnNldFdlYXRoZXJJY29uKHdlYXRoZXJPYmouaWNvbik7XG4gIHdlYXRoZXIudGV4dENvbnRlbnQgPSB3ZWF0aGVyT2JqLndlYXRoZXI7XG4gIHRlbXAudGV4dENvbnRlbnQgPSBgVGVtcGVyYXR1cmU6ICR7d2VhdGhlck9iai50ZW1wZXJhdHVyZX0gJHtjZWxPckZhcn1gO1xuICB0ZW1wRmVlbC50ZXh0Q29udGVudCA9IGBGZWVscyBMaWtlOiAke3dlYXRoZXJPYmoudGVtcGVyYXR1cmVGZWVsfSAke2NlbE9yRmFyfWA7XG4gIGh1bWlkaXR5LnRleHRDb250ZW50ID0gYEh1bWlkaXR5OiAke3dlYXRoZXJPYmouaHVtaWRpdHl9JWA7XG4gIHdpbmQudGV4dENvbnRlbnQgPSBgV2luZCBTcGVlZDogJHt3ZWF0aGVyT2JqLndpbmRTcGVlZH0ke21pbGVzUGhPck1ldGVyUGh9YDtcbiAgd2luZERlZy50ZXh0Q29udGVudCA9IGBXaW5kIERlZ3JlZTogJHt3ZWF0aGVyT2JqLndpbmREZWdyZWV9XFx1MDBCMGA7XG5cbiAgd2VhdGhlckNhcmQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbn1cblxuZnVuY3Rpb24gZGlzcGxheUhvdXJseVdlYXRoZXIoaG91cmx5V2VhdGhlckxpc3QpIHtcbiAgY29uc3QgdGFibGVDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaG91cmx5LXdlYXRoZXInKTtcbiAgY29uc3QgdGFibGVCb2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhYmxlLWJvZHknKTtcbiAgY29uc3QgY2hlY2tib3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVncmVlJyk7XG5cbiAgdGFibGVCb2R5LmlubmVySFRNTCA9ICcnO1xuICBsZXQgY2VsT3JGYXIgPSAnXFx1MjEwMyc7XG4gIGxldCBtaWxlc1BoT3JNZXRlclBoID0gJ20vaCc7XG4gIGlmIChjaGVja2JveC5jaGVja2VkKSB7XG4gICAgY2VsT3JGYXIgPSAnXFx1MjEwOSc7XG4gICAgbWlsZXNQaE9yTWV0ZXJQaCA9ICdtcGgnO1xuICB9XG4gIGhvdXJseVdlYXRoZXJMaXN0LmZvckVhY2goKHdlYXRoZXJPYmopID0+IHtcbiAgICBjb25zdCB0YWJsZVJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG4gICAgY29uc3QgdGRUaW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBjb25zdCB0ZEljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGNvbnN0IHRkVGVtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgY29uc3QgdGRXZWF0aGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBjb25zdCB0ZEZlZWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBjb25zdCB0ZFdpbmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGNvbnN0IHRkSHVtaWRpdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGNvbnN0IHRkSWNvbkltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh3ZWF0aGVyT2JqLmRhdGUpLnRvTG9jYWxlU3RyaW5nKCdkZWZhdWx0Jywge1xuICAgICAgd2Vla2RheTogJ3Nob3J0JywgbW9udGg6ICdzaG9ydCcsIGRheTogJzItZGlnaXQnLCBob3VyOiAnMi1kaWdpdCcsIG1pbnV0ZTogJzItZGlnaXQnLFxuICAgIH0pO1xuXG4gICAgdGRUaW1lLnRleHRDb250ZW50ID0gZGF0ZTtcbiAgICB0ZEljb25JbWcuc3JjID0gd2VhdGhlckltYWdlSGFuZGxlci5zZXRXZWF0aGVySWNvbih3ZWF0aGVyT2JqLmljb24pO1xuICAgIHRkVGVtcC50ZXh0Q29udGVudCA9IGAke3dlYXRoZXJPYmoudGVtcGVyYXR1cmV9ICR7Y2VsT3JGYXJ9YDtcbiAgICB0ZFdlYXRoZXIudGV4dENvbnRlbnQgPSB3ZWF0aGVyT2JqLndlYXRoZXI7XG4gICAgdGRGZWVscy50ZXh0Q29udGVudCA9IGAke3dlYXRoZXJPYmoudGVtcGVyYXR1cmVGZWVsfSAke2NlbE9yRmFyfWA7XG4gICAgdGRXaW5kLnRleHRDb250ZW50ID0gYCR7d2VhdGhlck9iai53aW5kU3BlZWR9JHttaWxlc1BoT3JNZXRlclBofWA7XG4gICAgdGRIdW1pZGl0eS50ZXh0Q29udGVudCA9IGAke3dlYXRoZXJPYmouaHVtaWRpdHl9JWA7XG4gICAgdGRJY29uLmFwcGVuZENoaWxkKHRkSWNvbkltZyk7XG4gICAgdGFibGVSb3cuYXBwZW5kKHRkVGltZSwgdGRJY29uLCB0ZFRlbXAsIHRkV2VhdGhlciwgdGRGZWVscywgdGRXaW5kLCB0ZEh1bWlkaXR5KTtcbiAgICB0YWJsZUJvZHkuYXBwZW5kQ2hpbGQodGFibGVSb3cpO1xuXG4gICAgdGFibGVDb250YWluZXIuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICB0ZEljb25JbWcuY2xhc3NMaXN0LmFkZCgndGFibGUtaWNvbicpO1xuICB9KTtcbn1cblxuZXhwb3J0IHsgZGlzcGxheUN1cnJlbnRXZWF0aGVyLCBkaXNwbGF5SG91cmx5V2VhdGhlciB9O1xuIiwiaW1wb3J0IGNsZWFyIGZyb20gJy4uL2Fzc2V0L2NsZWFyLmpwZyc7XG5pbXBvcnQgZmV3Q2xvdWRzIGZyb20gJy4uL2Fzc2V0L2Zld0Nsb3Vkcy5qcGcnO1xuaW1wb3J0IHNjYXR0ZXJlZENsb3VkIGZyb20gJy4uL2Fzc2V0L3NjYXR0ZXJkQ2xvdWRzLmpwZyc7XG5pbXBvcnQgYnJva2VuQ2xvdWQgZnJvbSAnLi4vYXNzZXQvYnJva2VuQ2xvdWRzLmpwZyc7XG5pbXBvcnQgbGlnaHRSYWluIGZyb20gJy4uL2Fzc2V0L2xpZ2h0UmFpbi5qcGcnO1xuaW1wb3J0IHJhaW4gZnJvbSAnLi4vYXNzZXQvcmFpbi5qcGcnO1xuaW1wb3J0IHRodW5kZXIgZnJvbSAnLi4vYXNzZXQvdGh1bmRlci5qcGcnO1xuaW1wb3J0IHNub3cgZnJvbSAnLi4vYXNzZXQvc25vdy5qcGcnO1xuaW1wb3J0IG1pc3QgZnJvbSAnLi4vYXNzZXQvbWlzdC5qcGcnO1xuXG5jb25zdCBpbWFnZXMgPSB7XG4gICcwMSc6IGNsZWFyLFxuICAnMDInOiBmZXdDbG91ZHMsXG4gICcwMyc6IHNjYXR0ZXJlZENsb3VkLFxuICAnMDQnOiBicm9rZW5DbG91ZCxcbiAgJzA5JzogbGlnaHRSYWluLFxuICAxMDogcmFpbixcbiAgMTE6IHRodW5kZXIsXG4gIDEzOiBzbm93LFxuICA1MDogbWlzdCxcbn07XG5cbmZ1bmN0aW9uIHNldFdlYXRoZXJJY29uKGljb24pIHtcbiAgcmV0dXJuIGBodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93bi8ke2ljb259QDJ4LnBuZ2A7XG59XG5cbmZ1bmN0aW9uIHNldEJhY2tncm91bmRJbWFnZShpZCkge1xuICBjb25zb2xlLmxvZyhpbWFnZXNbaWRdKTtcbiAgY29uc3QgbWFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21haW4nKTtcbiAgbWFpbi5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCR7aW1hZ2VzW2lkXX0pYDtcbn1cblxuZXhwb3J0IHsgc2V0V2VhdGhlckljb24sIHNldEJhY2tncm91bmRJbWFnZSB9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyY1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHNjcmlwdFVybCA9IHNjcmlwdHNbc2NyaXB0cy5sZW5ndGggLSAxXS5zcmNcblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiaW1wb3J0ICogYXMgd2VhdGhlckFwaSBmcm9tICcuL2pzL2FwaUZ1bmN0aW9ucyc7XG5pbXBvcnQgKiBhcyBkb21NYW5pcHVsYXRpb24gZnJvbSAnLi9qcy9kb21NYW5pcHVsYXRpb24nO1xuXG5jb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xvY2F0aW9uRm9ybScpO1xuY29uc3QgY2hlY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVncmVlJyk7XG5jaGVjay5jaGVja2VkID0gZmFsc2U7XG5cbmZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGV2ZW50KSA9PiB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIGNvbnN0IGlucHV0Qm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xvY2F0aW9uJyk7XG4gIGlmIChpbnB1dEJveC52YWx1ZSA9PT0gJycpIHtcbiAgICBpbnB1dEJveC5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xuICAgIHJldHVybjtcbiAgfVxuICBpbnB1dEJveC5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvcicpO1xuXG4gIHdlYXRoZXJBcGkuZ2VvbG9jYXRlQVBJQ2FsbCgpXG4gICAgLnRoZW4oKGpzb24pID0+IHtcbiAgICAgIGNvbnN0IHsgbGF0IH0gPSBqc29uWzBdO1xuICAgICAgY29uc3QgeyBsb24gfSA9IGpzb25bMF07XG4gICAgICBjb25zdCBjdXJyZW50V2VhdGhlclByb21pc2UgPSB3ZWF0aGVyQXBpLmdldEN1cnJlbnRXZWF0aGVyKGxhdCwgbG9uKTtcbiAgICAgIGNvbnN0IGhvdXJseVdlYXRoZXJQcm9taXNlID0gd2VhdGhlckFwaS5nZXRIb3VybHlXZWF0aGVyKGxhdCwgbG9uKTtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChbY3VycmVudFdlYXRoZXJQcm9taXNlLCBob3VybHlXZWF0aGVyUHJvbWlzZV0pO1xuICAgIH0pXG4gICAgLnRoZW4oKHdlYXRoZXJPYmplY3RzKSA9PiB7XG4gICAgICBkb21NYW5pcHVsYXRpb24uZGlzcGxheUN1cnJlbnRXZWF0aGVyKHdlYXRoZXJPYmplY3RzWzBdKTtcbiAgICAgIGRvbU1hbmlwdWxhdGlvbi5kaXNwbGF5SG91cmx5V2VhdGhlcih3ZWF0aGVyT2JqZWN0c1sxXSk7XG4gICAgfSlcbiAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgYWxlcnQoZXJyKTtcbiAgICB9KTtcbn0pO1xuXG5jaGVjay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbGFiZWwnKTtcbiAgY29uc29sZS5sb2coJ3Rlc3QnKTtcbiAgaWYgKGNoZWNrLmNoZWNrZWQpIHtcbiAgICBsYWJlbC50ZXh0Q29udGVudCA9ICdcXHUyMTA5JztcbiAgfSBlbHNlIHtcbiAgICBsYWJlbC50ZXh0Q29udGVudCA9ICdcXHUyMTAzJztcbiAgfVxufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=