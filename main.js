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
  console.log(`Lat:${latitude} , Lon: ${longitude}`);
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
    alert(err);
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
    const iconId = currentWeatherJson.weather[0].icon;

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
      icon: iconId,
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
  const weatherCard = document.querySelector('.weather-card');
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

  icon.src = (0,_weatherIconHandler__WEBPACK_IMPORTED_MODULE_0__["default"])(weatherObj.icon);
  weather.textContent = weatherObj.weather;
  temp.textContent = `Temperature: ${weatherObj.temperature} ${celOrFar}`;
  tempFeel.textContent = `Feels Like: ${weatherObj.temperatureFeel} ${celOrFar}`;
  wind.textContent = `Wind Speed: ${weatherObj.windSpeed}${milesPhOrMeterPh}`;
  windDeg.textContent = `Wind Degree: ${weatherObj.windDegree}\u00B0`;

  weatherCard.style.visibility = 'visible';
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
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBLG9GQUFvRixjQUFjLG9EQUFvRCxjQUFjO0FBQ3BLO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVSxVQUFVO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixVQUFVLFNBQVMsVUFBVTtBQUNsRCxvR0FBb0csU0FBUyxPQUFPLFVBQVUsU0FBUyxpQkFBaUIsNENBQTRDLGNBQWM7QUFDbE47QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvR0FBb0csU0FBUyxPQUFPLFVBQVUseURBQXlELGNBQWM7QUFDck07O0FBRUE7QUFDQSxhQUFhLEtBQUs7O0FBRWxCO0FBQ0EsYUFBYSxNQUFNOztBQUVuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsd0JBQXdCO0FBQ3JDLGFBQWEsV0FBVzs7QUFFeEI7QUFDQSxhQUFhLGdCQUFnQjtBQUM3QixhQUFhLDJCQUEyQjtBQUN4QyxhQUFhLG9CQUFvQjs7QUFFakM7QUFDQTs7QUFFc0U7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0ZwQjs7QUFFbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxhQUFhLCtEQUFjO0FBQzNCO0FBQ0EscUNBQXFDLHdCQUF3QixFQUFFLFNBQVM7QUFDeEUsd0NBQXdDLDRCQUE0QixFQUFFLFNBQVM7QUFDL0Usb0NBQW9DLHFCQUFxQixFQUFFLGlCQUFpQjtBQUM1RSx3Q0FBd0Msc0JBQXNCOztBQUU5RDtBQUNBOztBQUVBOztBQUVBOztBQUV1RDs7Ozs7Ozs7Ozs7Ozs7O0FDbEN4QztBQUNmLDZDQUE2QyxLQUFLO0FBQ2xEOzs7Ozs7O1VDRkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOZ0Q7QUFDUTs7QUFFeEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLFVBQVU7QUFDekMsRUFBRSwrREFBNEI7QUFDOUI7QUFDQSxNQUFNLHNFQUFxQztBQUMzQyxLQUFLO0FBQ0wsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2pzL2FwaUZ1bmN0aW9ucy5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9qcy9kb21NYW5pcHVsYXRpb24uanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvanMvd2VhdGhlckljb25IYW5kbGVyLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiYXN5bmMgZnVuY3Rpb24gZ2VvbG9jYXRlQVBJQ2FsbCgpIHtcbiAgY29uc3QgbG9jYXRpb25JbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2NhdGlvbicpLnZhbHVlO1xuICBjb25zdCBnZW9SZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9nZW8vMS4wL2RpcmVjdD9xPSR7bG9jYXRpb25JbnB1dH0mbGltaXQ9MSZhcHBpZD0zODRjMzNhMWY3ZWZkOTc0MzAwY2FjZGY2NDkxNzhkM2AsIHsgbW9kZTogJ2NvcnMnIH0pO1xuICBjb25zdCBnZW9Kc29uID0gYXdhaXQgZ2VvUmVzcG9uc2UuanNvbigpO1xuICByZXR1cm4gZ2VvSnNvbjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY3VycmVudFdlYXRoZXJBUElDYWxsKGxhdGl0dWRlLCBsb25naXR1ZGUpIHtcbiAgbGV0IG1ldHJpY09ySW1wZXJpYWwgPSAnbWV0cmljJztcbiAgY29uc3QgeyBjaGVja2VkIH0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVncmVlJyk7XG4gIGlmIChjaGVja2VkKSB7XG4gICAgbWV0cmljT3JJbXBlcmlhbCA9ICdpbXBlcmlhbCc7XG4gIH1cbiAgY29uc29sZS5sb2coYExhdDoke2xhdGl0dWRlfSAsIExvbjogJHtsb25naXR1ZGV9YCk7XG4gIGNvbnN0IGN1cnJlbnRXZWF0aGVyUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/bGF0PSR7bGF0aXR1ZGV9Jmxvbj0ke2xvbmdpdHVkZX0mdW5pdHM9JHttZXRyaWNPckltcGVyaWFsfSZhcHBpZD0zODRjMzNhMWY3ZWZkOTc0MzAwY2FjZGY2NDkxNzhkM2AsIHsgbW9kZTogJ2NvcnMnIH0pO1xuICBjb25zdCBjdXJyZW50V2VhdGhlckpzb24gPSBhd2FpdCBjdXJyZW50V2VhdGhlclJlc3BvbnNlLmpzb24oKTtcbiAgcmV0dXJuIGN1cnJlbnRXZWF0aGVySnNvbjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0Q3VycmVudFdlYXRoZXIoKSB7XG4gIGxldCBjdXJyZW50V2VhdGhlckpzb247XG4gIHRyeSB7XG4gICAgY29uc3QganNvbiA9IGF3YWl0IGdlb2xvY2F0ZUFQSUNhbGwoKTtcbiAgICBpZiAoanNvbi5sZW5ndGggPiAwKSB7XG4gICAgICBjdXJyZW50V2VhdGhlckpzb24gPSBhd2FpdCBjdXJyZW50V2VhdGhlckFQSUNhbGwoanNvblswXS5sYXQsIGpzb25bMF0ubG9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5cXCd0IGZpbmQgbG9jYXRpb24gd2l0aCB0aGF0IG5hbWUnKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICBhbGVydChlcnIpO1xuICB9XG4gIGlmIChjdXJyZW50V2VhdGhlckpzb24pIHtcbiAgLy8gY29uc3QgeyBkdCB9ID0gY3VycmVudFdlYXRoZXJKc29uO1xuICAgIGNvbnN0IGNpdHkgPSBjdXJyZW50V2VhdGhlckpzb24ubmFtZTtcbiAgICBjb25zdCBmZWVsTGlrZSA9IGN1cnJlbnRXZWF0aGVySnNvbi5tYWluLmZlZWxzX2xpa2U7XG4gICAgY29uc3QgeyB0ZW1wIH0gPSBjdXJyZW50V2VhdGhlckpzb24ubWFpbjtcbiAgICBjb25zdCBodW1pZCA9IGN1cnJlbnRXZWF0aGVySnNvbi5tYWluLmh1bWlkaXR5O1xuICAgIGNvbnN0IHRlbXBNYXggPSBjdXJyZW50V2VhdGhlckpzb24ubWFpbi50ZW1wX21heDtcbiAgICBjb25zdCB0ZW1wTWluID0gY3VycmVudFdlYXRoZXJKc29uLm1haW4udGVtcF9taW47XG5cbiAgICBjb25zdCB3ZWF0aGVyU3RhdGUgPSBjdXJyZW50V2VhdGhlckpzb24ud2VhdGhlclswXS5tYWluO1xuICAgIGNvbnN0IHdlYXRoZXJJZCA9IGN1cnJlbnRXZWF0aGVySnNvbi53ZWF0aGVyWzBdLmlkO1xuICAgIGNvbnN0IGljb25JZCA9IGN1cnJlbnRXZWF0aGVySnNvbi53ZWF0aGVyWzBdLmljb247XG5cbiAgICBjb25zdCB3aW5kTVBTID0gY3VycmVudFdlYXRoZXJKc29uLndpbmQuc3BlZWQ7XG4gICAgY29uc3Qgd2luZERlZyA9IGN1cnJlbnRXZWF0aGVySnNvbi53aW5kLmRlZztcblxuICAgIGNvbnN0IHdlYXRoZXJPYmogPSB7XG4gICAgICBuYW1lOiBjaXR5LFxuICAgICAgdGVtcGVyYXR1cmU6IHRlbXAsXG4gICAgICB0ZW1wZXJhdHVyZUZlZWw6IGZlZWxMaWtlLFxuICAgICAgdGVtcGVyYXR1cmVNYXg6IHRlbXBNYXgsXG4gICAgICB0ZW1wZXJhdHVyZU1pbjogdGVtcE1pbixcbiAgICAgIGh1bWlkaXR5OiBodW1pZCxcbiAgICAgIHdlYXRoZXI6IHdlYXRoZXJTdGF0ZSxcbiAgICAgIGlkOiB3ZWF0aGVySWQsXG4gICAgICBpY29uOiBpY29uSWQsXG4gICAgICB3aW5kU3BlZWQ6IHdpbmRNUFMsXG4gICAgICB3aW5kRGVncmVlOiB3aW5kRGVnLFxuICAgIH07XG4gICAgY29uc29sZS5sb2coY3VycmVudFdlYXRoZXJKc29uKTtcbiAgICByZXR1cm4gd2VhdGhlck9iajtcbiAgfVxufVxuXG4vLyBmdW5jdGlvbiBob3VybHlXZWF0aGVyQVBJKCkge1xuLy8gICAvLyBjb25zdCB3ZWF0aGVyUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L2ZvcmVjYXN0P2xhdD0ke2xhdGl0dWRlfSZsb249JHtsb25naXR1ZGV9JnVuaXRzPW1ldHJpYyZhcHBpZD0zODRjMzNhMWY3ZWZkOTc0MzAwY2FjZGY2NDkxNzhkM2AsIHsgbW9kZTogJ2NvcnMnIH0pO1xuLy8gICAvLyBjb25zdCB3ZWF0aGVySnNvbiA9IGF3YWl0IHdlYXRoZXJSZXNwb25zZS5qc29uKCk7XG5cbi8vICAgLy8gICAgRGF0ZSwgYW5kIEhvdXJcbi8vICAgY29uc3QgeyBkdCB9ID0gd2VhdGhlckpzb24ubGlzdFswXTtcblxuLy8gICAvLyAgICBQb3AoUHJvYmFiaWxpdHkgb2YgUmFpbikuXG4vLyAgIGNvbnN0IHsgcG9wIH0gPSB3ZWF0aGVySnNvbi5saXN0WzBdO1xuXG4vLyAgIC8vICAgIENoZWNrIGZvciBSYWluIG9yIFNub3cgYW5kIGRpc3BsYXkgaW5mby5cbi8vICAgaWYgKHdlYXRoZXJKc29uLmxpc3RbMF0ucmFpbikge1xuLy8gICAgIGNvbnN0IHJhaW5Wb2x1bWUgPSB3ZWF0aGVySnNvbi5saXN0WzBdLnJhaW5bJzNoJ107XG4vLyAgICAgY29uc29sZS5sb2cocmFpblZvbHVtZSk7XG4vLyAgIH1cblxuLy8gICAvLyAgICBHZXQgVGVtcGVyYXR1cmUsIEZlZWxzIGxpa2UgVGVtcCwgSHVtaWRpdHlcbi8vICAgY29uc3QgeyB0ZW1wIH0gPSB3ZWF0aGVySnNvbi5saXN0WzBdLm1haW47XG4vLyAgIGNvbnN0IHsgZmVlbHNfbGlrZTogZmVlbHNMaWtlIH0gPSB3ZWF0aGVySnNvbi5saXN0WzBdLm1haW47XG4vLyAgIGNvbnN0IHsgaHVtaWRpdHkgfSA9IHdlYXRoZXJKc29uLmxpc3RbMF0ubWFpbjtcblxuLy8gICAvLyAgICBXZWF0aGVyIElELCBXZWF0aGVyIFN0YXRlXG4vLyAgIGNvbnN0IHsgaWQ6IHdlYXRoZXJJRCB9ID0gd2VhdGhlckpzb24ubGlzdFswXS53ZWF0aGVyWzBdO1xuLy8gICBjb25zdCB7IGRlc2NyaXB0aW9uOiB3ZWF0aGVyRGVzYyB9ID0gd2VhdGhlckpzb24ubGlzdFswXS53ZWF0aGVyWzBdO1xuLy8gICBjb25zdCB7IG1haW46IHdlYXRoZXJNYWluIH0gPSB3ZWF0aGVySnNvbi5saXN0WzBdLndlYXRoZXJbMF07XG5cbi8vICAgLy8gICAgUGFzcyBpbmZvIHRvIGRpc3BsYXkgdG8gSFRNTFxuLy8gfVxuXG5leHBvcnQgeyBnZW9sb2NhdGVBUElDYWxsLCBjdXJyZW50V2VhdGhlckFQSUNhbGwsIGdldEN1cnJlbnRXZWF0aGVyIH07XG4iLCJpbXBvcnQgc2V0V2VhdGhlckljb24gZnJvbSAnLi93ZWF0aGVySWNvbkhhbmRsZXInO1xuXG5mdW5jdGlvbiBkaXNwbGF5Q3VycmVudFdlYXRoZXIod2VhdGhlck9iaikge1xuICBjb25zdCB3ZWF0aGVyQ2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53ZWF0aGVyLWNhcmQnKTtcbiAgY29uc3QgY2l0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjaXR5Jyk7XG4gIGNvbnN0IGljb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaWNvbicpO1xuICBjb25zdCB3ZWF0aGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dlYXRoZXInKTtcbiAgY29uc3QgdGVtcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0ZW1wJyk7XG4gIGNvbnN0IHRlbXBGZWVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RlbXBGZWVsJyk7XG4gIGNvbnN0IHdpbmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd2luZCcpO1xuICBjb25zdCB3aW5kRGVnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dpbmREZWcnKTtcbiAgY29uc3QgY2hlY2tib3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVncmVlJyk7XG4gIGxldCBjZWxPckZhciA9ICdcXHUyMTAzJztcbiAgbGV0IG1pbGVzUGhPck1ldGVyUGggPSAnbS9oJztcbiAgaWYgKGNoZWNrYm94LmNoZWNrZWQpIHtcbiAgICBjZWxPckZhciA9ICdcXHUyMTA5JztcbiAgICBtaWxlc1BoT3JNZXRlclBoID0gJ21waCc7XG4gIH1cbiAgY2l0eS50ZXh0Q29udGVudCA9IHdlYXRoZXJPYmoubmFtZTtcblxuICBpY29uLnNyYyA9IHNldFdlYXRoZXJJY29uKHdlYXRoZXJPYmouaWNvbik7XG4gIHdlYXRoZXIudGV4dENvbnRlbnQgPSB3ZWF0aGVyT2JqLndlYXRoZXI7XG4gIHRlbXAudGV4dENvbnRlbnQgPSBgVGVtcGVyYXR1cmU6ICR7d2VhdGhlck9iai50ZW1wZXJhdHVyZX0gJHtjZWxPckZhcn1gO1xuICB0ZW1wRmVlbC50ZXh0Q29udGVudCA9IGBGZWVscyBMaWtlOiAke3dlYXRoZXJPYmoudGVtcGVyYXR1cmVGZWVsfSAke2NlbE9yRmFyfWA7XG4gIHdpbmQudGV4dENvbnRlbnQgPSBgV2luZCBTcGVlZDogJHt3ZWF0aGVyT2JqLndpbmRTcGVlZH0ke21pbGVzUGhPck1ldGVyUGh9YDtcbiAgd2luZERlZy50ZXh0Q29udGVudCA9IGBXaW5kIERlZ3JlZTogJHt3ZWF0aGVyT2JqLndpbmREZWdyZWV9XFx1MDBCMGA7XG5cbiAgd2VhdGhlckNhcmQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbn1cblxuZnVuY3Rpb24gZGlzcGxheUhvdXJseVdlYXRoZXIoKSB7XG5cbn1cblxuZXhwb3J0IHsgZGlzcGxheUN1cnJlbnRXZWF0aGVyLCBkaXNwbGF5SG91cmx5V2VhdGhlciB9O1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2V0V2VhdGhlckljb24oaWNvbikge1xuICByZXR1cm4gYGh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3duLyR7aWNvbn1AMngucG5nYDtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0ICogYXMgd2VhdGhlckFwaSBmcm9tICcuL2pzL2FwaUZ1bmN0aW9ucyc7XG5pbXBvcnQgKiBhcyBkb21NYW5pcHVsYXRpb24gZnJvbSAnLi9qcy9kb21NYW5pcHVsYXRpb24nO1xuXG5jb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xvY2F0aW9uRm9ybScpO1xuXG5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChldmVudCkgPT4ge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBjb25zdCBpbnB1dEJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2NhdGlvbicpO1xuICBpZiAoaW5wdXRCb3gudmFsdWUgPT09ICcnKSB7IHJldHVybjsgfSAvLyBTZXQgRXJyb3IgaGFuZGxpbmdcbiAgd2VhdGhlckFwaS5nZXRDdXJyZW50V2VhdGhlcigpXG4gICAgLnRoZW4oKG9iaikgPT4ge1xuICAgICAgZG9tTWFuaXB1bGF0aW9uLmRpc3BsYXlDdXJyZW50V2VhdGhlcihvYmopO1xuICAgIH0pO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=