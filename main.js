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
  const icon = document.querySelector('#icon');
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
  icon.src = (0,_weatherIconHandler__WEBPACK_IMPORTED_MODULE_0__["default"])(weatherObj.id);
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

module.exports = __webpack_require__.p + "images/cloudy.svg";

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBLG9GQUFvRixjQUFjLG9EQUFvRCxjQUFjO0FBQ3BLO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVSxVQUFVO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLG9HQUFvRyxTQUFTLE9BQU8sVUFBVSxTQUFTLGlCQUFpQiw0Q0FBNEMsY0FBYztBQUNsTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9HQUFvRyxTQUFTLE9BQU8sVUFBVSx5REFBeUQsY0FBYztBQUNyTTs7QUFFQTtBQUNBLGFBQWEsS0FBSzs7QUFFbEI7QUFDQSxhQUFhLE1BQU07O0FBRW5CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSx3QkFBd0I7QUFDckMsYUFBYSxXQUFXOztBQUV4QjtBQUNBLGFBQWEsZ0JBQWdCO0FBQzdCLGFBQWEsMkJBQTJCO0FBQ3hDLGFBQWEsb0JBQW9COztBQUVqQztBQUNBOztBQUVzRTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzRnBCOztBQUVsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLCtEQUFjO0FBQzNCO0FBQ0EscUNBQXFDLHdCQUF3QixFQUFFLFNBQVM7QUFDeEUsd0NBQXdDLDRCQUE0QixFQUFFLFNBQVM7QUFDL0Usb0NBQW9DLHFCQUFxQixFQUFFLGlCQUFpQjtBQUM1RSx3Q0FBd0Msc0JBQXNCO0FBQzlEOztBQUVBOztBQUVBOztBQUV1RDs7Ozs7Ozs7Ozs7Ozs7OztBQy9CZDs7QUFFMUI7QUFDZjtBQUNBLGNBQWMsOENBQU07QUFDcEIsU0FBUyw4Q0FBTTtBQUNmOzs7Ozs7Ozs7Ozs7Ozs7OztVQ05BO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1dDUEQ7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7Ozs7Ozs7Ozs7O0FDZmdEO0FBQ1E7O0FBRXhEOztBQUVBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixVQUFVO0FBQ3pDLEVBQUUsK0RBQTRCO0FBQzlCO0FBQ0EsTUFBTSxzRUFBcUM7QUFDM0MsS0FBSztBQUNMLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9qcy9hcGlGdW5jdGlvbnMuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvanMvZG9tTWFuaXB1bGF0aW9uLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2pzL3dlYXRoZXJJY29uSGFuZGxlci5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiYXN5bmMgZnVuY3Rpb24gZ2VvbG9jYXRlQVBJQ2FsbCgpIHtcbiAgY29uc3QgbG9jYXRpb25JbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2NhdGlvbicpLnZhbHVlO1xuICBjb25zdCBnZW9SZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9nZW8vMS4wL2RpcmVjdD9xPSR7bG9jYXRpb25JbnB1dH0mbGltaXQ9MSZhcHBpZD0zODRjMzNhMWY3ZWZkOTc0MzAwY2FjZGY2NDkxNzhkM2AsIHsgbW9kZTogJ2NvcnMnIH0pO1xuICBjb25zdCBnZW9Kc29uID0gYXdhaXQgZ2VvUmVzcG9uc2UuanNvbigpO1xuICByZXR1cm4gZ2VvSnNvbjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY3VycmVudFdlYXRoZXJBUElDYWxsKGxhdGl0dWRlLCBsb25naXR1ZGUpIHtcbiAgbGV0IG1ldHJpY09ySW1wZXJpYWwgPSAnbWV0cmljJztcbiAgY29uc3QgeyBjaGVja2VkIH0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVncmVlJyk7XG4gIGlmIChjaGVja2VkKSB7XG4gICAgbWV0cmljT3JJbXBlcmlhbCA9ICdpbXBlcmlhbCc7XG4gIH1cbiAgY29uc3QgY3VycmVudFdlYXRoZXJSZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvd2VhdGhlcj9sYXQ9JHtsYXRpdHVkZX0mbG9uPSR7bG9uZ2l0dWRlfSZ1bml0cz0ke21ldHJpY09ySW1wZXJpYWx9JmFwcGlkPTM4NGMzM2ExZjdlZmQ5NzQzMDBjYWNkZjY0OTE3OGQzYCwgeyBtb2RlOiAnY29ycycgfSk7XG4gIGNvbnN0IGN1cnJlbnRXZWF0aGVySnNvbiA9IGF3YWl0IGN1cnJlbnRXZWF0aGVyUmVzcG9uc2UuanNvbigpO1xuICByZXR1cm4gY3VycmVudFdlYXRoZXJKc29uO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRDdXJyZW50V2VhdGhlcigpIHtcbiAgbGV0IGN1cnJlbnRXZWF0aGVySnNvbjtcbiAgdHJ5IHtcbiAgICBjb25zdCBqc29uID0gYXdhaXQgZ2VvbG9jYXRlQVBJQ2FsbCgpO1xuICAgIGlmIChqc29uLmxlbmd0aCA+IDApIHtcbiAgICAgIGN1cnJlbnRXZWF0aGVySnNvbiA9IGF3YWl0IGN1cnJlbnRXZWF0aGVyQVBJQ2FsbChqc29uWzBdLmxhdCwganNvblswXS5sb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhblxcJ3QgZmluZCBsb2NhdGlvbiB3aXRoIHRoYXQgbmFtZScpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnIpO1xuICB9XG4gIGlmIChjdXJyZW50V2VhdGhlckpzb24pIHtcbiAgLy8gY29uc3QgeyBkdCB9ID0gY3VycmVudFdlYXRoZXJKc29uO1xuICAgIGNvbnN0IGNpdHkgPSBjdXJyZW50V2VhdGhlckpzb24ubmFtZTtcbiAgICBjb25zdCBmZWVsTGlrZSA9IGN1cnJlbnRXZWF0aGVySnNvbi5tYWluLmZlZWxzX2xpa2U7XG4gICAgY29uc3QgeyB0ZW1wIH0gPSBjdXJyZW50V2VhdGhlckpzb24ubWFpbjtcbiAgICBjb25zdCBodW1pZCA9IGN1cnJlbnRXZWF0aGVySnNvbi5tYWluLmh1bWlkaXR5O1xuICAgIGNvbnN0IHRlbXBNYXggPSBjdXJyZW50V2VhdGhlckpzb24ubWFpbi50ZW1wX21heDtcbiAgICBjb25zdCB0ZW1wTWluID0gY3VycmVudFdlYXRoZXJKc29uLm1haW4udGVtcF9taW47XG5cbiAgICBjb25zdCB3ZWF0aGVyU3RhdGUgPSBjdXJyZW50V2VhdGhlckpzb24ud2VhdGhlclswXS5tYWluO1xuICAgIGNvbnN0IHdlYXRoZXJJZCA9IGN1cnJlbnRXZWF0aGVySnNvbi53ZWF0aGVyWzBdLmlkO1xuXG4gICAgY29uc3Qgd2luZE1QUyA9IGN1cnJlbnRXZWF0aGVySnNvbi53aW5kLnNwZWVkO1xuICAgIGNvbnN0IHdpbmREZWcgPSBjdXJyZW50V2VhdGhlckpzb24ud2luZC5kZWc7XG5cbiAgICBjb25zdCB3ZWF0aGVyT2JqID0ge1xuICAgICAgbmFtZTogY2l0eSxcbiAgICAgIHRlbXBlcmF0dXJlOiB0ZW1wLFxuICAgICAgdGVtcGVyYXR1cmVGZWVsOiBmZWVsTGlrZSxcbiAgICAgIHRlbXBlcmF0dXJlTWF4OiB0ZW1wTWF4LFxuICAgICAgdGVtcGVyYXR1cmVNaW46IHRlbXBNaW4sXG4gICAgICBodW1pZGl0eTogaHVtaWQsXG4gICAgICB3ZWF0aGVyOiB3ZWF0aGVyU3RhdGUsXG4gICAgICBpZDogd2VhdGhlcklkLFxuICAgICAgd2luZFNwZWVkOiB3aW5kTVBTLFxuICAgICAgd2luZERlZ3JlZTogd2luZERlZyxcbiAgICB9O1xuICAgIGNvbnNvbGUubG9nKGN1cnJlbnRXZWF0aGVySnNvbik7XG4gICAgcmV0dXJuIHdlYXRoZXJPYmo7XG4gIH1cbn1cblxuLy8gZnVuY3Rpb24gaG91cmx5V2VhdGhlckFQSSgpIHtcbi8vICAgLy8gY29uc3Qgd2VhdGhlclJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS9mb3JlY2FzdD9sYXQ9JHtsYXRpdHVkZX0mbG9uPSR7bG9uZ2l0dWRlfSZ1bml0cz1tZXRyaWMmYXBwaWQ9Mzg0YzMzYTFmN2VmZDk3NDMwMGNhY2RmNjQ5MTc4ZDNgLCB7IG1vZGU6ICdjb3JzJyB9KTtcbi8vICAgLy8gY29uc3Qgd2VhdGhlckpzb24gPSBhd2FpdCB3ZWF0aGVyUmVzcG9uc2UuanNvbigpO1xuXG4vLyAgIC8vICAgIERhdGUsIGFuZCBIb3VyXG4vLyAgIGNvbnN0IHsgZHQgfSA9IHdlYXRoZXJKc29uLmxpc3RbMF07XG5cbi8vICAgLy8gICAgUG9wKFByb2JhYmlsaXR5IG9mIFJhaW4pLlxuLy8gICBjb25zdCB7IHBvcCB9ID0gd2VhdGhlckpzb24ubGlzdFswXTtcblxuLy8gICAvLyAgICBDaGVjayBmb3IgUmFpbiBvciBTbm93IGFuZCBkaXNwbGF5IGluZm8uXG4vLyAgIGlmICh3ZWF0aGVySnNvbi5saXN0WzBdLnJhaW4pIHtcbi8vICAgICBjb25zdCByYWluVm9sdW1lID0gd2VhdGhlckpzb24ubGlzdFswXS5yYWluWyczaCddO1xuLy8gICAgIGNvbnNvbGUubG9nKHJhaW5Wb2x1bWUpO1xuLy8gICB9XG5cbi8vICAgLy8gICAgR2V0IFRlbXBlcmF0dXJlLCBGZWVscyBsaWtlIFRlbXAsIEh1bWlkaXR5XG4vLyAgIGNvbnN0IHsgdGVtcCB9ID0gd2VhdGhlckpzb24ubGlzdFswXS5tYWluO1xuLy8gICBjb25zdCB7IGZlZWxzX2xpa2U6IGZlZWxzTGlrZSB9ID0gd2VhdGhlckpzb24ubGlzdFswXS5tYWluO1xuLy8gICBjb25zdCB7IGh1bWlkaXR5IH0gPSB3ZWF0aGVySnNvbi5saXN0WzBdLm1haW47XG5cbi8vICAgLy8gICAgV2VhdGhlciBJRCwgV2VhdGhlciBTdGF0ZVxuLy8gICBjb25zdCB7IGlkOiB3ZWF0aGVySUQgfSA9IHdlYXRoZXJKc29uLmxpc3RbMF0ud2VhdGhlclswXTtcbi8vICAgY29uc3QgeyBkZXNjcmlwdGlvbjogd2VhdGhlckRlc2MgfSA9IHdlYXRoZXJKc29uLmxpc3RbMF0ud2VhdGhlclswXTtcbi8vICAgY29uc3QgeyBtYWluOiB3ZWF0aGVyTWFpbiB9ID0gd2VhdGhlckpzb24ubGlzdFswXS53ZWF0aGVyWzBdO1xuXG4vLyAgIC8vICAgIFBhc3MgaW5mbyB0byBkaXNwbGF5IHRvIEhUTUxcbi8vIH1cblxuZXhwb3J0IHsgZ2VvbG9jYXRlQVBJQ2FsbCwgY3VycmVudFdlYXRoZXJBUElDYWxsLCBnZXRDdXJyZW50V2VhdGhlciB9O1xuIiwiaW1wb3J0IHNldFdlYXRoZXJJY29uIGZyb20gJy4vd2VhdGhlckljb25IYW5kbGVyJztcblxuZnVuY3Rpb24gZGlzcGxheUN1cnJlbnRXZWF0aGVyKHdlYXRoZXJPYmopIHtcbiAgY29uc3QgY2l0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjaXR5Jyk7XG4gIGNvbnN0IGljb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaWNvbicpO1xuICBjb25zdCB3ZWF0aGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dlYXRoZXInKTtcbiAgY29uc3QgdGVtcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0ZW1wJyk7XG4gIGNvbnN0IHRlbXBGZWVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RlbXBGZWVsJyk7XG4gIGNvbnN0IHdpbmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd2luZCcpO1xuICBjb25zdCB3aW5kRGVnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dpbmREZWcnKTtcbiAgY29uc3QgY2hlY2tib3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVncmVlJyk7XG4gIGxldCBjZWxPckZhciA9ICdcXHUyMTAzJztcbiAgbGV0IG1pbGVzUGhPck1ldGVyUGggPSAnbS9oJztcbiAgaWYgKGNoZWNrYm94LmNoZWNrZWQpIHtcbiAgICBjZWxPckZhciA9ICdcXHUyMTA5JztcbiAgICBtaWxlc1BoT3JNZXRlclBoID0gJ21waCc7XG4gIH1cblxuICBjaXR5LnRleHRDb250ZW50ID0gd2VhdGhlck9iai5uYW1lO1xuICBpY29uLnNyYyA9IHNldFdlYXRoZXJJY29uKHdlYXRoZXJPYmouaWQpO1xuICB3ZWF0aGVyLnRleHRDb250ZW50ID0gd2VhdGhlck9iai53ZWF0aGVyO1xuICB0ZW1wLnRleHRDb250ZW50ID0gYFRlbXBlcmF0dXJlOiAke3dlYXRoZXJPYmoudGVtcGVyYXR1cmV9ICR7Y2VsT3JGYXJ9YDtcbiAgdGVtcEZlZWwudGV4dENvbnRlbnQgPSBgRmVlbHMgTGlrZTogJHt3ZWF0aGVyT2JqLnRlbXBlcmF0dXJlRmVlbH0gJHtjZWxPckZhcn1gO1xuICB3aW5kLnRleHRDb250ZW50ID0gYFdpbmQgU3BlZWQ6ICR7d2VhdGhlck9iai53aW5kU3BlZWR9JHttaWxlc1BoT3JNZXRlclBofWA7XG4gIHdpbmREZWcudGV4dENvbnRlbnQgPSBgV2luZCBEZWdyZWU6ICR7d2VhdGhlck9iai53aW5kRGVncmVlfVxcdTAwQjBgO1xufVxuXG5mdW5jdGlvbiBkaXNwbGF5SG91cmx5V2VhdGhlcigpIHtcblxufVxuXG5leHBvcnQgeyBkaXNwbGF5Q3VycmVudFdlYXRoZXIsIGRpc3BsYXlIb3VybHlXZWF0aGVyIH07XG4iLCJpbXBvcnQgY2xvdWR5IGZyb20gJy4uL2Fzc2V0L2Nsb3VkeS5zdmcnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZXRXZWF0aGVySWNvbihpZCkge1xuICBjb25zb2xlLmxvZyhpZCk7XG4gIGNvbnNvbGUubG9nKGNsb3VkeSk7XG4gIHJldHVybiBjbG91ZHk7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjXG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkgc2NyaXB0VXJsID0gc2NyaXB0c1tzY3JpcHRzLmxlbmd0aCAtIDFdLnNyY1xuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJpbXBvcnQgKiBhcyB3ZWF0aGVyQXBpIGZyb20gJy4vanMvYXBpRnVuY3Rpb25zJztcbmltcG9ydCAqIGFzIGRvbU1hbmlwdWxhdGlvbiBmcm9tICcuL2pzL2RvbU1hbmlwdWxhdGlvbic7XG5cbmNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbG9jYXRpb25Gb3JtJyk7XG5cbmZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGV2ZW50KSA9PiB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIGNvbnN0IGlucHV0Qm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xvY2F0aW9uJyk7XG4gIGlmIChpbnB1dEJveC52YWx1ZSA9PT0gJycpIHsgcmV0dXJuOyB9IC8vIFNldCBFcnJvciBoYW5kbGluZ1xuICB3ZWF0aGVyQXBpLmdldEN1cnJlbnRXZWF0aGVyKClcbiAgICAudGhlbigob2JqKSA9PiB7XG4gICAgICBkb21NYW5pcHVsYXRpb24uZGlzcGxheUN1cnJlbnRXZWF0aGVyKG9iaik7XG4gICAgfSk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==