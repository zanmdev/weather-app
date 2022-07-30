/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
async function geolocateAPICall() {
  const locationInput = document.querySelector('#location').value;
  const geoResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${locationInput}&limit=1&appid=384c33a1f7efd974300cacdf649178d3`, { mode: 'cors' });
  const geoJson = await geoResponse.json();
  return geoJson;
}

async function currentWeatherAPICall(latitude, longitude) {
  const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=384c33a1f7efd974300cacdf649178d3`, { mode: 'cors' });
  const currentWeatherJson = await currentWeatherResponse.json();
  console.log(latitude, longitude);
  return currentWeatherJson;
}

function getCurrentWeather() {
  geolocateAPICall()
    .then((json) => currentWeatherAPICall(json[0].lat, json[0].lon))

    .then((currentWeatherJson) => {
      // const { dt } = currentWeatherJson;
      const feelLike = currentWeatherJson.main.feels_like;
      const { temp } = currentWeatherJson.main;
      const humid = currentWeatherJson.main.humidity;
      const tempMax = currentWeatherJson.main.temp_max;
      const tempMin = currentWeatherJson.main.temp_min;

      const weatherState = currentWeatherJson.weather[0].main;
      const weatherId = currentWeatherJson.weather[0].id;
      const weatherDesc = currentWeatherJson.weather[0].description;

      const windMPS = currentWeatherJson.wind.speed;
      const windDeg = currentWeatherJson.wind.deg;

      const weatherObj = {
        temperature: temp,
        temperatureFeel: feelLike,
        temperatureMax: tempMax,
        temperatureMin: tempMin,
        humidity: humid,
        weather: weatherState,
        description: weatherDesc,
        id: weatherId,
        windSpeed: windMPS,
        windDegree: windDeg,
      };

      console.log(weatherObj);
      return weatherObj;
    });
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

const form = document.querySelector('#locationForm');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  getCurrentWeather();
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQSxvRkFBb0YsY0FBYyxvREFBb0QsY0FBYztBQUNwSztBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvR0FBb0csU0FBUyxPQUFPLFVBQVUsNENBQTRDLGNBQWM7QUFDeEw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLEtBQUs7QUFDdEI7QUFDQSxjQUFjLE9BQU87QUFDckI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0Esb0dBQW9HLFNBQVMsT0FBTyxVQUFVLHlEQUF5RCxjQUFjO0FBQ3JNOztBQUVBO0FBQ0EsYUFBYSxLQUFLOztBQUVsQjtBQUNBLGFBQWEsTUFBTTs7QUFFbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLHdCQUF3QjtBQUNyQyxhQUFhLFdBQVc7O0FBRXhCO0FBQ0EsYUFBYSxnQkFBZ0I7QUFDN0IsYUFBYSwyQkFBMkI7QUFDeEMsYUFBYSxvQkFBb0I7O0FBRWpDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiYXN5bmMgZnVuY3Rpb24gZ2VvbG9jYXRlQVBJQ2FsbCgpIHtcbiAgY29uc3QgbG9jYXRpb25JbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2NhdGlvbicpLnZhbHVlO1xuICBjb25zdCBnZW9SZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9nZW8vMS4wL2RpcmVjdD9xPSR7bG9jYXRpb25JbnB1dH0mbGltaXQ9MSZhcHBpZD0zODRjMzNhMWY3ZWZkOTc0MzAwY2FjZGY2NDkxNzhkM2AsIHsgbW9kZTogJ2NvcnMnIH0pO1xuICBjb25zdCBnZW9Kc29uID0gYXdhaXQgZ2VvUmVzcG9uc2UuanNvbigpO1xuICByZXR1cm4gZ2VvSnNvbjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY3VycmVudFdlYXRoZXJBUElDYWxsKGxhdGl0dWRlLCBsb25naXR1ZGUpIHtcbiAgY29uc3QgY3VycmVudFdlYXRoZXJSZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvd2VhdGhlcj9sYXQ9JHtsYXRpdHVkZX0mbG9uPSR7bG9uZ2l0dWRlfSZhcHBpZD0zODRjMzNhMWY3ZWZkOTc0MzAwY2FjZGY2NDkxNzhkM2AsIHsgbW9kZTogJ2NvcnMnIH0pO1xuICBjb25zdCBjdXJyZW50V2VhdGhlckpzb24gPSBhd2FpdCBjdXJyZW50V2VhdGhlclJlc3BvbnNlLmpzb24oKTtcbiAgY29uc29sZS5sb2cobGF0aXR1ZGUsIGxvbmdpdHVkZSk7XG4gIHJldHVybiBjdXJyZW50V2VhdGhlckpzb247XG59XG5cbmZ1bmN0aW9uIGdldEN1cnJlbnRXZWF0aGVyKCkge1xuICBnZW9sb2NhdGVBUElDYWxsKClcbiAgICAudGhlbigoanNvbikgPT4gY3VycmVudFdlYXRoZXJBUElDYWxsKGpzb25bMF0ubGF0LCBqc29uWzBdLmxvbikpXG5cbiAgICAudGhlbigoY3VycmVudFdlYXRoZXJKc29uKSA9PiB7XG4gICAgICAvLyBjb25zdCB7IGR0IH0gPSBjdXJyZW50V2VhdGhlckpzb247XG4gICAgICBjb25zdCBmZWVsTGlrZSA9IGN1cnJlbnRXZWF0aGVySnNvbi5tYWluLmZlZWxzX2xpa2U7XG4gICAgICBjb25zdCB7IHRlbXAgfSA9IGN1cnJlbnRXZWF0aGVySnNvbi5tYWluO1xuICAgICAgY29uc3QgaHVtaWQgPSBjdXJyZW50V2VhdGhlckpzb24ubWFpbi5odW1pZGl0eTtcbiAgICAgIGNvbnN0IHRlbXBNYXggPSBjdXJyZW50V2VhdGhlckpzb24ubWFpbi50ZW1wX21heDtcbiAgICAgIGNvbnN0IHRlbXBNaW4gPSBjdXJyZW50V2VhdGhlckpzb24ubWFpbi50ZW1wX21pbjtcblxuICAgICAgY29uc3Qgd2VhdGhlclN0YXRlID0gY3VycmVudFdlYXRoZXJKc29uLndlYXRoZXJbMF0ubWFpbjtcbiAgICAgIGNvbnN0IHdlYXRoZXJJZCA9IGN1cnJlbnRXZWF0aGVySnNvbi53ZWF0aGVyWzBdLmlkO1xuICAgICAgY29uc3Qgd2VhdGhlckRlc2MgPSBjdXJyZW50V2VhdGhlckpzb24ud2VhdGhlclswXS5kZXNjcmlwdGlvbjtcblxuICAgICAgY29uc3Qgd2luZE1QUyA9IGN1cnJlbnRXZWF0aGVySnNvbi53aW5kLnNwZWVkO1xuICAgICAgY29uc3Qgd2luZERlZyA9IGN1cnJlbnRXZWF0aGVySnNvbi53aW5kLmRlZztcblxuICAgICAgY29uc3Qgd2VhdGhlck9iaiA9IHtcbiAgICAgICAgdGVtcGVyYXR1cmU6IHRlbXAsXG4gICAgICAgIHRlbXBlcmF0dXJlRmVlbDogZmVlbExpa2UsXG4gICAgICAgIHRlbXBlcmF0dXJlTWF4OiB0ZW1wTWF4LFxuICAgICAgICB0ZW1wZXJhdHVyZU1pbjogdGVtcE1pbixcbiAgICAgICAgaHVtaWRpdHk6IGh1bWlkLFxuICAgICAgICB3ZWF0aGVyOiB3ZWF0aGVyU3RhdGUsXG4gICAgICAgIGRlc2NyaXB0aW9uOiB3ZWF0aGVyRGVzYyxcbiAgICAgICAgaWQ6IHdlYXRoZXJJZCxcbiAgICAgICAgd2luZFNwZWVkOiB3aW5kTVBTLFxuICAgICAgICB3aW5kRGVncmVlOiB3aW5kRGVnLFxuICAgICAgfTtcblxuICAgICAgY29uc29sZS5sb2cod2VhdGhlck9iaik7XG4gICAgICByZXR1cm4gd2VhdGhlck9iajtcbiAgICB9KTtcbn1cblxuLy8gZnVuY3Rpb24gaG91cmx5V2VhdGhlckFQSSgpIHtcbi8vICAgLy8gY29uc3Qgd2VhdGhlclJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS9mb3JlY2FzdD9sYXQ9JHtsYXRpdHVkZX0mbG9uPSR7bG9uZ2l0dWRlfSZ1bml0cz1tZXRyaWMmYXBwaWQ9Mzg0YzMzYTFmN2VmZDk3NDMwMGNhY2RmNjQ5MTc4ZDNgLCB7IG1vZGU6ICdjb3JzJyB9KTtcbi8vICAgLy8gY29uc3Qgd2VhdGhlckpzb24gPSBhd2FpdCB3ZWF0aGVyUmVzcG9uc2UuanNvbigpO1xuXG4vLyAgIC8vICAgIERhdGUsIGFuZCBIb3VyXG4vLyAgIGNvbnN0IHsgZHQgfSA9IHdlYXRoZXJKc29uLmxpc3RbMF07XG5cbi8vICAgLy8gICAgUG9wKFByb2JhYmlsaXR5IG9mIFJhaW4pLlxuLy8gICBjb25zdCB7IHBvcCB9ID0gd2VhdGhlckpzb24ubGlzdFswXTtcblxuLy8gICAvLyAgICBDaGVjayBmb3IgUmFpbiBvciBTbm93IGFuZCBkaXNwbGF5IGluZm8uXG4vLyAgIGlmICh3ZWF0aGVySnNvbi5saXN0WzBdLnJhaW4pIHtcbi8vICAgICBjb25zdCByYWluVm9sdW1lID0gd2VhdGhlckpzb24ubGlzdFswXS5yYWluWyczaCddO1xuLy8gICAgIGNvbnNvbGUubG9nKHJhaW5Wb2x1bWUpO1xuLy8gICB9XG5cbi8vICAgLy8gICAgR2V0IFRlbXBlcmF0dXJlLCBGZWVscyBsaWtlIFRlbXAsIEh1bWlkaXR5XG4vLyAgIGNvbnN0IHsgdGVtcCB9ID0gd2VhdGhlckpzb24ubGlzdFswXS5tYWluO1xuLy8gICBjb25zdCB7IGZlZWxzX2xpa2U6IGZlZWxzTGlrZSB9ID0gd2VhdGhlckpzb24ubGlzdFswXS5tYWluO1xuLy8gICBjb25zdCB7IGh1bWlkaXR5IH0gPSB3ZWF0aGVySnNvbi5saXN0WzBdLm1haW47XG5cbi8vICAgLy8gICAgV2VhdGhlciBJRCwgV2VhdGhlciBTdGF0ZVxuLy8gICBjb25zdCB7IGlkOiB3ZWF0aGVySUQgfSA9IHdlYXRoZXJKc29uLmxpc3RbMF0ud2VhdGhlclswXTtcbi8vICAgY29uc3QgeyBkZXNjcmlwdGlvbjogd2VhdGhlckRlc2MgfSA9IHdlYXRoZXJKc29uLmxpc3RbMF0ud2VhdGhlclswXTtcbi8vICAgY29uc3QgeyBtYWluOiB3ZWF0aGVyTWFpbiB9ID0gd2VhdGhlckpzb24ubGlzdFswXS53ZWF0aGVyWzBdO1xuXG4vLyAgIC8vICAgIFBhc3MgaW5mbyB0byBkaXNwbGF5IHRvIEhUTUxcbi8vIH1cblxuY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2NhdGlvbkZvcm0nKTtcbmZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGV2ZW50KSA9PiB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIGdldEN1cnJlbnRXZWF0aGVyKCk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==