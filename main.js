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
/* harmony export */   "getCurrentWeather": () => (/* binding */ getCurrentWeather)
/* harmony export */ });
async function geolocateAPICall() {
  const locationInput = document.querySelector('#location').value;
  const geoResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${locationInput}&limit=1&appid=384c33a1f7efd974300cacdf649178d3`, { mode: 'cors' });
  const geoJson = await geoResponse.json();
  return geoJson;
}

async function currentWeatherAPICall(latitude, longitude) {
  let metricOrImperial = 'metric';
  const { checked } = document.querySelector('#degree');
  if (checked) {
    metricOrImperial = 'imperial';
  }
  const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${metricOrImperial}&appid=384c33a1f7efd974300cacdf649178d3`, { mode: 'cors' });
  const currentWeatherJson = await currentWeatherResponse.json();
  return currentWeatherJson;
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
  }
  if (currentWeatherJson) {
  // const { dt } = currentWeatherJson;
    const city = currentWeatherJson.name;
    const feelLike = currentWeatherJson.main.feels_like;
    const { temp } = currentWeatherJson.main;
    const humid = currentWeatherJson.main.humidity;
    const tempMax = currentWeatherJson.main.temp_max;
    const tempMin = currentWeatherJson.main.temp_min;

    const weatherState = currentWeatherJson.weather[0].main;
    const weatherId = currentWeatherJson.weather[0].id;

    const windMPS = currentWeatherJson.wind.speed;
    const windDeg = currentWeatherJson.wind.deg;

    const weatherObj = {
      name: city,
      temperature: temp,
      temperatureFeel: feelLike,
      temperatureMax: tempMax,
      temperatureMin: tempMin,
      humidity: humid,
      weather: weatherState,
      id: weatherId,
      windSpeed: windMPS,
      windDegree: windDeg,
    };
    console.log(currentWeatherJson);
    return weatherObj;
  }
}

// function hourlyWeatherAPI() {
//   // const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=384c33a1f7efd974300cacdf649178d3`, { mode: 'cors' });
//   // const weatherJson = await weatherResponse.json();

//   //    Date, and Hour
//   const { dt } = weatherJson.list[0];

//   //    Pop(Probability of Rain).
//   const { pop } = weatherJson.list[0];

//   //    Check for Rain or Snow and display info.
//   if (weatherJson.list[0].rain) {
//     const rainVolume = weatherJson.list[0].rain['3h'];
//     console.log(rainVolume);
//   }

//   //    Get Temperature, Feels like Temp, Humidity
//   const { temp } = weatherJson.list[0].main;
//   const { feels_like: feelsLike } = weatherJson.list[0].main;
//   const { humidity } = weatherJson.list[0].main;

//   //    Weather ID, Weather State
//   const { id: weatherID } = weatherJson.list[0].weather[0];
//   const { description: weatherDesc } = weatherJson.list[0].weather[0];
//   const { main: weatherMain } = weatherJson.list[0].weather[0];

//   //    Pass info to display to HTML
// }




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
  const city = document.querySelector('#city');
  const icon = (0,_weatherIconHandler__WEBPACK_IMPORTED_MODULE_0__["default"])(weatherObj.id);
  const weather = document.querySelector('#weather');
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
  temp.textContent = `Temperature: ${weatherObj.temperature} ${celOrFar}`;
  tempFeel.textContent = `Feels Like: ${weatherObj.temperatureFeel} ${celOrFar}`;
  wind.textContent = `Wind Speed: ${weatherObj.windSpeed}${milesPhOrMeterPh}`;
  windDeg.textContent = `Wind Degree: ${weatherObj.windDegree}\u00B0`;
}

function displayHourlyWeather() {

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
/* harmony import */ var _asset_cloudy_svg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../asset/cloudy.svg */ "./src/asset/cloudy.svg");


function setWeatherIcon(id) {
  console.log(id);
  console.log(_asset_cloudy_svg__WEBPACK_IMPORTED_MODULE_0__);
  return _asset_cloudy_svg__WEBPACK_IMPORTED_MODULE_0__;
}


/***/ }),

/***/ "./src/asset/cloudy.svg":
/*!******************************!*\
  !*** ./src/asset/cloudy.svg ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "4397f9c37525fb862537.svg";

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

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const inputBox = document.querySelector('#location');
  if (inputBox.value === '') { return; } // Set Error handling
  _js_apiFunctions__WEBPACK_IMPORTED_MODULE_0__.getCurrentWeather()
    .then((obj) => {
      _js_domManipulation__WEBPACK_IMPORTED_MODULE_1__.displayCurrentWeather(obj);
    });
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBLG9GQUFvRixjQUFjLG9EQUFvRCxjQUFjO0FBQ3BLO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVSxVQUFVO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLG9HQUFvRyxTQUFTLE9BQU8sVUFBVSxTQUFTLGlCQUFpQiw0Q0FBNEMsY0FBYztBQUNsTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9HQUFvRyxTQUFTLE9BQU8sVUFBVSx5REFBeUQsY0FBYztBQUNyTTs7QUFFQTtBQUNBLGFBQWEsS0FBSzs7QUFFbEI7QUFDQSxhQUFhLE1BQU07O0FBRW5CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSx3QkFBd0I7QUFDckMsYUFBYSxXQUFXOztBQUV4QjtBQUNBLGFBQWEsZ0JBQWdCO0FBQzdCLGFBQWEsMkJBQTJCO0FBQ3hDLGFBQWEsb0JBQW9COztBQUVqQztBQUNBOztBQUVzRTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzRnBCOztBQUVsRDtBQUNBO0FBQ0EsZUFBZSwrREFBYztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxxQ0FBcUMsd0JBQXdCLEVBQUUsU0FBUztBQUN4RSx3Q0FBd0MsNEJBQTRCLEVBQUUsU0FBUztBQUMvRSxvQ0FBb0MscUJBQXFCLEVBQUUsaUJBQWlCO0FBQzVFLHdDQUF3QyxzQkFBc0I7QUFDOUQ7O0FBRUE7O0FBRUE7O0FBRXVEOzs7Ozs7Ozs7Ozs7Ozs7O0FDL0JkOztBQUUxQjtBQUNmO0FBQ0EsY0FBYyw4Q0FBTTtBQUNwQixTQUFTLDhDQUFNO0FBQ2Y7Ozs7Ozs7Ozs7Ozs7Ozs7O1VDTkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7Ozs7Ozs7Ozs7QUNmZ0Q7QUFDUTs7QUFFeEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLFVBQVU7QUFDekMsRUFBRSwrREFBNEI7QUFDOUI7QUFDQSxNQUFNLHNFQUFxQztBQUMzQyxLQUFLO0FBQ0wsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2pzL2FwaUZ1bmN0aW9ucy5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9qcy9kb21NYW5pcHVsYXRpb24uanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvanMvd2VhdGhlckljb25IYW5kbGVyLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJhc3luYyBmdW5jdGlvbiBnZW9sb2NhdGVBUElDYWxsKCkge1xuICBjb25zdCBsb2NhdGlvbklucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xvY2F0aW9uJykudmFsdWU7XG4gIGNvbnN0IGdlb1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2dlby8xLjAvZGlyZWN0P3E9JHtsb2NhdGlvbklucHV0fSZsaW1pdD0xJmFwcGlkPTM4NGMzM2ExZjdlZmQ5NzQzMDBjYWNkZjY0OTE3OGQzYCwgeyBtb2RlOiAnY29ycycgfSk7XG4gIGNvbnN0IGdlb0pzb24gPSBhd2FpdCBnZW9SZXNwb25zZS5qc29uKCk7XG4gIHJldHVybiBnZW9Kc29uO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjdXJyZW50V2VhdGhlckFQSUNhbGwobGF0aXR1ZGUsIGxvbmdpdHVkZSkge1xuICBsZXQgbWV0cmljT3JJbXBlcmlhbCA9ICdtZXRyaWMnO1xuICBjb25zdCB7IGNoZWNrZWQgfSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZWdyZWUnKTtcbiAgaWYgKGNoZWNrZWQpIHtcbiAgICBtZXRyaWNPckltcGVyaWFsID0gJ2ltcGVyaWFsJztcbiAgfVxuICBjb25zdCBjdXJyZW50V2VhdGhlclJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP2xhdD0ke2xhdGl0dWRlfSZsb249JHtsb25naXR1ZGV9JnVuaXRzPSR7bWV0cmljT3JJbXBlcmlhbH0mYXBwaWQ9Mzg0YzMzYTFmN2VmZDk3NDMwMGNhY2RmNjQ5MTc4ZDNgLCB7IG1vZGU6ICdjb3JzJyB9KTtcbiAgY29uc3QgY3VycmVudFdlYXRoZXJKc29uID0gYXdhaXQgY3VycmVudFdlYXRoZXJSZXNwb25zZS5qc29uKCk7XG4gIHJldHVybiBjdXJyZW50V2VhdGhlckpzb247XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEN1cnJlbnRXZWF0aGVyKCkge1xuICBsZXQgY3VycmVudFdlYXRoZXJKc29uO1xuICB0cnkge1xuICAgIGNvbnN0IGpzb24gPSBhd2FpdCBnZW9sb2NhdGVBUElDYWxsKCk7XG4gICAgaWYgKGpzb24ubGVuZ3RoID4gMCkge1xuICAgICAgY3VycmVudFdlYXRoZXJKc29uID0gYXdhaXQgY3VycmVudFdlYXRoZXJBUElDYWxsKGpzb25bMF0ubGF0LCBqc29uWzBdLmxvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2FuXFwndCBmaW5kIGxvY2F0aW9uIHdpdGggdGhhdCBuYW1lJyk7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycik7XG4gIH1cbiAgaWYgKGN1cnJlbnRXZWF0aGVySnNvbikge1xuICAvLyBjb25zdCB7IGR0IH0gPSBjdXJyZW50V2VhdGhlckpzb247XG4gICAgY29uc3QgY2l0eSA9IGN1cnJlbnRXZWF0aGVySnNvbi5uYW1lO1xuICAgIGNvbnN0IGZlZWxMaWtlID0gY3VycmVudFdlYXRoZXJKc29uLm1haW4uZmVlbHNfbGlrZTtcbiAgICBjb25zdCB7IHRlbXAgfSA9IGN1cnJlbnRXZWF0aGVySnNvbi5tYWluO1xuICAgIGNvbnN0IGh1bWlkID0gY3VycmVudFdlYXRoZXJKc29uLm1haW4uaHVtaWRpdHk7XG4gICAgY29uc3QgdGVtcE1heCA9IGN1cnJlbnRXZWF0aGVySnNvbi5tYWluLnRlbXBfbWF4O1xuICAgIGNvbnN0IHRlbXBNaW4gPSBjdXJyZW50V2VhdGhlckpzb24ubWFpbi50ZW1wX21pbjtcblxuICAgIGNvbnN0IHdlYXRoZXJTdGF0ZSA9IGN1cnJlbnRXZWF0aGVySnNvbi53ZWF0aGVyWzBdLm1haW47XG4gICAgY29uc3Qgd2VhdGhlcklkID0gY3VycmVudFdlYXRoZXJKc29uLndlYXRoZXJbMF0uaWQ7XG5cbiAgICBjb25zdCB3aW5kTVBTID0gY3VycmVudFdlYXRoZXJKc29uLndpbmQuc3BlZWQ7XG4gICAgY29uc3Qgd2luZERlZyA9IGN1cnJlbnRXZWF0aGVySnNvbi53aW5kLmRlZztcblxuICAgIGNvbnN0IHdlYXRoZXJPYmogPSB7XG4gICAgICBuYW1lOiBjaXR5LFxuICAgICAgdGVtcGVyYXR1cmU6IHRlbXAsXG4gICAgICB0ZW1wZXJhdHVyZUZlZWw6IGZlZWxMaWtlLFxuICAgICAgdGVtcGVyYXR1cmVNYXg6IHRlbXBNYXgsXG4gICAgICB0ZW1wZXJhdHVyZU1pbjogdGVtcE1pbixcbiAgICAgIGh1bWlkaXR5OiBodW1pZCxcbiAgICAgIHdlYXRoZXI6IHdlYXRoZXJTdGF0ZSxcbiAgICAgIGlkOiB3ZWF0aGVySWQsXG4gICAgICB3aW5kU3BlZWQ6IHdpbmRNUFMsXG4gICAgICB3aW5kRGVncmVlOiB3aW5kRGVnLFxuICAgIH07XG4gICAgY29uc29sZS5sb2coY3VycmVudFdlYXRoZXJKc29uKTtcbiAgICByZXR1cm4gd2VhdGhlck9iajtcbiAgfVxufVxuXG4vLyBmdW5jdGlvbiBob3VybHlXZWF0aGVyQVBJKCkge1xuLy8gICAvLyBjb25zdCB3ZWF0aGVyUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L2ZvcmVjYXN0P2xhdD0ke2xhdGl0dWRlfSZsb249JHtsb25naXR1ZGV9JnVuaXRzPW1ldHJpYyZhcHBpZD0zODRjMzNhMWY3ZWZkOTc0MzAwY2FjZGY2NDkxNzhkM2AsIHsgbW9kZTogJ2NvcnMnIH0pO1xuLy8gICAvLyBjb25zdCB3ZWF0aGVySnNvbiA9IGF3YWl0IHdlYXRoZXJSZXNwb25zZS5qc29uKCk7XG5cbi8vICAgLy8gICAgRGF0ZSwgYW5kIEhvdXJcbi8vICAgY29uc3QgeyBkdCB9ID0gd2VhdGhlckpzb24ubGlzdFswXTtcblxuLy8gICAvLyAgICBQb3AoUHJvYmFiaWxpdHkgb2YgUmFpbikuXG4vLyAgIGNvbnN0IHsgcG9wIH0gPSB3ZWF0aGVySnNvbi5saXN0WzBdO1xuXG4vLyAgIC8vICAgIENoZWNrIGZvciBSYWluIG9yIFNub3cgYW5kIGRpc3BsYXkgaW5mby5cbi8vICAgaWYgKHdlYXRoZXJKc29uLmxpc3RbMF0ucmFpbikge1xuLy8gICAgIGNvbnN0IHJhaW5Wb2x1bWUgPSB3ZWF0aGVySnNvbi5saXN0WzBdLnJhaW5bJzNoJ107XG4vLyAgICAgY29uc29sZS5sb2cocmFpblZvbHVtZSk7XG4vLyAgIH1cblxuLy8gICAvLyAgICBHZXQgVGVtcGVyYXR1cmUsIEZlZWxzIGxpa2UgVGVtcCwgSHVtaWRpdHlcbi8vICAgY29uc3QgeyB0ZW1wIH0gPSB3ZWF0aGVySnNvbi5saXN0WzBdLm1haW47XG4vLyAgIGNvbnN0IHsgZmVlbHNfbGlrZTogZmVlbHNMaWtlIH0gPSB3ZWF0aGVySnNvbi5saXN0WzBdLm1haW47XG4vLyAgIGNvbnN0IHsgaHVtaWRpdHkgfSA9IHdlYXRoZXJKc29uLmxpc3RbMF0ubWFpbjtcblxuLy8gICAvLyAgICBXZWF0aGVyIElELCBXZWF0aGVyIFN0YXRlXG4vLyAgIGNvbnN0IHsgaWQ6IHdlYXRoZXJJRCB9ID0gd2VhdGhlckpzb24ubGlzdFswXS53ZWF0aGVyWzBdO1xuLy8gICBjb25zdCB7IGRlc2NyaXB0aW9uOiB3ZWF0aGVyRGVzYyB9ID0gd2VhdGhlckpzb24ubGlzdFswXS53ZWF0aGVyWzBdO1xuLy8gICBjb25zdCB7IG1haW46IHdlYXRoZXJNYWluIH0gPSB3ZWF0aGVySnNvbi5saXN0WzBdLndlYXRoZXJbMF07XG5cbi8vICAgLy8gICAgUGFzcyBpbmZvIHRvIGRpc3BsYXkgdG8gSFRNTFxuLy8gfVxuXG5leHBvcnQgeyBnZW9sb2NhdGVBUElDYWxsLCBjdXJyZW50V2VhdGhlckFQSUNhbGwsIGdldEN1cnJlbnRXZWF0aGVyIH07XG4iLCJpbXBvcnQgc2V0V2VhdGhlckljb24gZnJvbSAnLi93ZWF0aGVySWNvbkhhbmRsZXInO1xuXG5mdW5jdGlvbiBkaXNwbGF5Q3VycmVudFdlYXRoZXIod2VhdGhlck9iaikge1xuICBjb25zdCBjaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NpdHknKTtcbiAgY29uc3QgaWNvbiA9IHNldFdlYXRoZXJJY29uKHdlYXRoZXJPYmouaWQpO1xuICBjb25zdCB3ZWF0aGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dlYXRoZXInKTtcbiAgY29uc3QgdGVtcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0ZW1wJyk7XG4gIGNvbnN0IHRlbXBGZWVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RlbXBGZWVsJyk7XG4gIGNvbnN0IHdpbmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd2luZCcpO1xuICBjb25zdCB3aW5kRGVnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dpbmREZWcnKTtcbiAgY29uc3QgY2hlY2tib3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVncmVlJyk7XG4gIGxldCBjZWxPckZhciA9ICdcXHUyMTAzJztcbiAgbGV0IG1pbGVzUGhPck1ldGVyUGggPSAnbS9oJztcbiAgaWYgKGNoZWNrYm94LmNoZWNrZWQpIHtcbiAgICBjZWxPckZhciA9ICdcXHUyMTA5JztcbiAgICBtaWxlc1BoT3JNZXRlclBoID0gJ21waCc7XG4gIH1cblxuICBjaXR5LnRleHRDb250ZW50ID0gd2VhdGhlck9iai5uYW1lO1xuXG4gIHdlYXRoZXIudGV4dENvbnRlbnQgPSB3ZWF0aGVyT2JqLndlYXRoZXI7XG4gIHRlbXAudGV4dENvbnRlbnQgPSBgVGVtcGVyYXR1cmU6ICR7d2VhdGhlck9iai50ZW1wZXJhdHVyZX0gJHtjZWxPckZhcn1gO1xuICB0ZW1wRmVlbC50ZXh0Q29udGVudCA9IGBGZWVscyBMaWtlOiAke3dlYXRoZXJPYmoudGVtcGVyYXR1cmVGZWVsfSAke2NlbE9yRmFyfWA7XG4gIHdpbmQudGV4dENvbnRlbnQgPSBgV2luZCBTcGVlZDogJHt3ZWF0aGVyT2JqLndpbmRTcGVlZH0ke21pbGVzUGhPck1ldGVyUGh9YDtcbiAgd2luZERlZy50ZXh0Q29udGVudCA9IGBXaW5kIERlZ3JlZTogJHt3ZWF0aGVyT2JqLndpbmREZWdyZWV9XFx1MDBCMGA7XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlIb3VybHlXZWF0aGVyKCkge1xuXG59XG5cbmV4cG9ydCB7IGRpc3BsYXlDdXJyZW50V2VhdGhlciwgZGlzcGxheUhvdXJseVdlYXRoZXIgfTtcbiIsImltcG9ydCBjbG91ZHkgZnJvbSAnLi4vYXNzZXQvY2xvdWR5LnN2Zyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNldFdlYXRoZXJJY29uKGlkKSB7XG4gIGNvbnNvbGUubG9nKGlkKTtcbiAgY29uc29sZS5sb2coY2xvdWR5KTtcbiAgcmV0dXJuIGNsb3VkeTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmNcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSBzY3JpcHRVcmwgPSBzY3JpcHRzW3NjcmlwdHMubGVuZ3RoIC0gMV0uc3JjXG5cdH1cbn1cbi8vIFdoZW4gc3VwcG9ydGluZyBicm93c2VycyB3aGVyZSBhbiBhdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIHlvdSBtdXN0IHNwZWNpZnkgYW4gb3V0cHV0LnB1YmxpY1BhdGggbWFudWFsbHkgdmlhIGNvbmZpZ3VyYXRpb25cbi8vIG9yIHBhc3MgYW4gZW1wdHkgc3RyaW5nIChcIlwiKSBhbmQgc2V0IHRoZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB2YXJpYWJsZSBmcm9tIHlvdXIgY29kZSB0byB1c2UgeW91ciBvd24gbG9naWMuXG5pZiAoIXNjcmlwdFVybCkgdGhyb3cgbmV3IEVycm9yKFwiQXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7XG5zY3JpcHRVcmwgPSBzY3JpcHRVcmwucmVwbGFjZSgvIy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcL1teXFwvXSskLywgXCIvXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gc2NyaXB0VXJsOyIsImltcG9ydCAqIGFzIHdlYXRoZXJBcGkgZnJvbSAnLi9qcy9hcGlGdW5jdGlvbnMnO1xuaW1wb3J0ICogYXMgZG9tTWFuaXB1bGF0aW9uIGZyb20gJy4vanMvZG9tTWFuaXB1bGF0aW9uJztcblxuY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2NhdGlvbkZvcm0nKTtcblxuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZXZlbnQpID0+IHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgY29uc3QgaW5wdXRCb3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbG9jYXRpb24nKTtcbiAgaWYgKGlucHV0Qm94LnZhbHVlID09PSAnJykgeyByZXR1cm47IH0gLy8gU2V0IEVycm9yIGhhbmRsaW5nXG4gIHdlYXRoZXJBcGkuZ2V0Q3VycmVudFdlYXRoZXIoKVxuICAgIC50aGVuKChvYmopID0+IHtcbiAgICAgIGRvbU1hbmlwdWxhdGlvbi5kaXNwbGF5Q3VycmVudFdlYXRoZXIob2JqKTtcbiAgICB9KTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9