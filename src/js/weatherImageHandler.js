import clear from '../asset/clear.jpg';
import fewClouds from '../asset/fewClouds.jpg';
import scatteredCloud from '../asset/scatterdClouds.jpg';
import brokenCloud from '../asset/brokenClouds.jpg';
import lightRain from '../asset/lightRain.jpg';
import rain from '../asset/rain.jpg';
import thunder from '../asset/thunder.jpg';
import snow from '../asset/snow.jpg';
import mist from '../asset/mist.jpg';

const images = {
  '01': clear,
  '02': fewClouds,
  '03': scatteredCloud,
  '04': brokenCloud,
  '09': lightRain,
  10: rain,
  11: thunder,
  13: snow,
  50: mist,
};

function setWeatherIcon(icon) {
  return `http://openweathermap.org/img/wn/${icon}@2x.png`;
}

function setBackgroundImage(id) {
  console.log(images[id]);
  const main = document.querySelector('main');
  main.style.backgroundImage = `url(${images[id]})`;
}

export { setWeatherIcon, setBackgroundImage };
