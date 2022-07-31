/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _js_apiFunctions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/apiFunctions */ \"./src/js/apiFunctions.js\");\n/* harmony import */ var _js_domManipulation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./js/domManipulation */ \"./src/js/domManipulation.js\");\n\n\n\nconst form = document.querySelector('#locationForm');\n\nform.addEventListener('submit', (event) => {\n  event.preventDefault();\n  _js_apiFunctions__WEBPACK_IMPORTED_MODULE_0__.getCurrentWeather()\n    .then((obj) => {\n      _js_domManipulation__WEBPACK_IMPORTED_MODULE_1__.displayCurrentWeather(obj);\n    });\n});\n\n\n//# sourceURL=webpack://weather-app/./src/index.js?");

/***/ }),

/***/ "./src/js/apiFunctions.js":
/*!********************************!*\
  !*** ./src/js/apiFunctions.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"currentWeatherAPICall\": () => (/* binding */ currentWeatherAPICall),\n/* harmony export */   \"geolocateAPICall\": () => (/* binding */ geolocateAPICall),\n/* harmony export */   \"getCurrentWeather\": () => (/* binding */ getCurrentWeather)\n/* harmony export */ });\nasync function geolocateAPICall() {\n  const locationInput = document.querySelector('#location').value;\n  const geoResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${locationInput}&limit=1&appid=384c33a1f7efd974300cacdf649178d3`, { mode: 'cors' });\n  const geoJson = await geoResponse.json();\n  return geoJson;\n}\n\nasync function currentWeatherAPICall(latitude, longitude) {\n  let metricOrImperial = 'metric';\n  const { checked } = document.querySelector('#degree');\n  if (checked) {\n    metricOrImperial = 'imperial';\n  }\n  const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${metricOrImperial}&appid=384c33a1f7efd974300cacdf649178d3`, { mode: 'cors' });\n  const currentWeatherJson = await currentWeatherResponse.json();\n  return currentWeatherJson;\n}\n\nasync function getCurrentWeather() {\n  let currentWeatherJson;\n  try {\n    const json = await geolocateAPICall();\n    if (json.length > 0) {\n      currentWeatherJson = await currentWeatherAPICall(json[0].lat, json[0].lon);\n    } else {\n      throw new Error('Can\\'t find location with that name');\n    }\n  } catch (err) {\n    console.error(err);\n  }\n  if (currentWeatherJson) {\n  // const { dt } = currentWeatherJson;\n    const city = currentWeatherJson.name;\n    const feelLike = currentWeatherJson.main.feels_like;\n    const { temp } = currentWeatherJson.main;\n    const humid = currentWeatherJson.main.humidity;\n    const tempMax = currentWeatherJson.main.temp_max;\n    const tempMin = currentWeatherJson.main.temp_min;\n\n    const weatherState = currentWeatherJson.weather[0].main;\n    const weatherId = currentWeatherJson.weather[0].id;\n    const weatherDesc = currentWeatherJson.weather[0].description;\n\n    const windMPS = currentWeatherJson.wind.speed;\n    const windDeg = currentWeatherJson.wind.deg;\n\n    const weatherObj = {\n      name: city,\n      temperature: temp,\n      temperatureFeel: feelLike,\n      temperatureMax: tempMax,\n      temperatureMin: tempMin,\n      humidity: humid,\n      weather: weatherState,\n      description: weatherDesc,\n      id: weatherId,\n      windSpeed: windMPS,\n      windDegree: windDeg,\n    };\n    console.log(currentWeatherJson);\n    return weatherObj;\n  }\n}\n\n// function hourlyWeatherAPI() {\n//   // const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=384c33a1f7efd974300cacdf649178d3`, { mode: 'cors' });\n//   // const weatherJson = await weatherResponse.json();\n\n//   //    Date, and Hour\n//   const { dt } = weatherJson.list[0];\n\n//   //    Pop(Probability of Rain).\n//   const { pop } = weatherJson.list[0];\n\n//   //    Check for Rain or Snow and display info.\n//   if (weatherJson.list[0].rain) {\n//     const rainVolume = weatherJson.list[0].rain['3h'];\n//     console.log(rainVolume);\n//   }\n\n//   //    Get Temperature, Feels like Temp, Humidity\n//   const { temp } = weatherJson.list[0].main;\n//   const { feels_like: feelsLike } = weatherJson.list[0].main;\n//   const { humidity } = weatherJson.list[0].main;\n\n//   //    Weather ID, Weather State\n//   const { id: weatherID } = weatherJson.list[0].weather[0];\n//   const { description: weatherDesc } = weatherJson.list[0].weather[0];\n//   const { main: weatherMain } = weatherJson.list[0].weather[0];\n\n//   //    Pass info to display to HTML\n// }\n\n\n\n\n//# sourceURL=webpack://weather-app/./src/js/apiFunctions.js?");

/***/ }),

/***/ "./src/js/domManipulation.js":
/*!***********************************!*\
  !*** ./src/js/domManipulation.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"displayCurrentWeather\": () => (/* binding */ displayCurrentWeather),\n/* harmony export */   \"displayHourlyWeather\": () => (/* binding */ displayHourlyWeather)\n/* harmony export */ });\nfunction displayCurrentWeather(weatherObj) {\n  const city = document.querySelector('#city');\n  const weather = document.querySelector('#weather');\n  const weatherDesc = document.querySelector('#weatherDesc');\n  const temp = document.querySelector('#temp');\n  const tempFeel = document.querySelector('#tempFeel');\n  const wind = document.querySelector('#wind');\n  const windDeg = document.querySelector('#windDeg');\n  const checkbox = document.querySelector('#degree');\n  let celOrFar = '\\u2103';\n  let milesPhOrMeterPh = 'm/h';\n  if (checkbox.checked) {\n    celOrFar = '\\u2109';\n    milesPhOrMeterPh = 'mph';\n  }\n\n  city.textContent = weatherObj.name;\n  weather.textContent = weatherObj.weather;\n  weatherDesc.textContent = weatherObj.description;\n  temp.textContent = `${weatherObj.temperature} ${celOrFar}`;\n  tempFeel.textContent = `${weatherObj.temperatureFeel} ${celOrFar}`;\n  wind.textContent = `${weatherObj.windSpeed} ${milesPhOrMeterPh}`;\n  windDeg.textContent = `${weatherObj.windDegree} \\u00B0`;\n}\n\nfunction displayHourlyWeather() {\n\n}\n\n\n\n\n//# sourceURL=webpack://weather-app/./src/js/domManipulation.js?");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;