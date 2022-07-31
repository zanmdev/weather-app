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

export { geolocateAPICall, currentWeatherAPICall, getCurrentWeather };
