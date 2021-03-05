import anime from "../node_modules/animejs/lib/anime.es.js";

const apiKey = "3c3b648ddb3385500b31cf35f9aa2167";
const urlLatLon = (cityName) =>
  `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
const urlWeather = (lat, lon) =>
  `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely&lang=pt_br&appid=${apiKey}`;
const searchButton = document.querySelector("button");
const searchInput = document.querySelector(".location");
const form = document.querySelector(".search");

const animeInfo = () => {
  anime({
    targets: ".main-info",
    translateX: [-800, 0],
    delay: 400,
    easing: "spring(0, 10, 10, 20)",
  });
};

const animeCityName = () => {
  anime({
    targets: ".city-name",
    opacity: [0, 1],
    translateY: [-40, 0],
    duration: 700,
    delay: 400,
    easing: "easeOutElastic(1, .6)",
  });
};

async function getAndShowCityName(lon, lat) {
  const latLonApiKey = "b2c693299fe54c9abe92324f6bc7eddf";
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lon}&key=${latLonApiKey}`;

  const cityInfo = await fetch(url);
  const cityInfoData = await cityInfo.json();

  const cityNameTitle = document.querySelector(".city-name");

  cityNameTitle.innerText = `${
    cityInfoData.results[0].components.hamlet ||
    cityInfoData.results[0].components.region
  },
    ${cityInfoData.results[0].components.country}`;
}

async function getCoords(cityName) {
  const latLon = await fetch(urlLatLon(cityName));
  const latLonData = await latLon.json();
  const { lon, lat } = await latLonData.coord;
  getAndShowCityName(lon, lat);
  return { lon, lat };
}

function showWeatherTemp({ current, current: { weather } }) {
  const temperature = document.querySelector(".temperature");
  const weatherName = document.querySelector(".weather-name");
  const weatherImg = document.querySelector(".weather-description img");
  document.body.style.backgroundImage = `url('../img/weathers/${weather[0].main.toLowerCase()}.jpg')`;

  temperature.innerText = `${current.temp.toFixed(1)}ºC`;
  weatherName.innerText = weather[0].description;
  weatherImg.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
}

function getAndShowTime({ current: { dt: currentMinutes } }) {
  const dateEl = document.querySelector(".date");
  const date = new Date(currentMinutes * 1000);
  const weekday = date
    .toLocaleString("pt-BR", { weekday: "short" })
    .replace(".", ",");
  const day = date.toLocaleString("pt-BR", { day: "2-digit" }).replace(".", "");
  const month = date
    .toLocaleString("pt-BR", { month: "short" })
    .replace(".", "");

  dateEl.innerHTML = `${
    weekday.charAt(0).toUpperCase() + weekday.slice(1)
  } ${day} ${month.charAt(0).toUpperCase() + month.slice(1)}`;
}

async function getWeather({ lon, lat }) {
  const weatherInfo = await fetch(urlWeather(lat, lon));
  const weatherInfoData = await weatherInfo.json();
  showWeatherTemp(weatherInfoData);
  getAndShowTime(weatherInfoData);
}

searchButton.addEventListener("click", async () => {
  const coords = await getCoords(searchInput.value);
  await getWeather(coords);
  animeInfo();
  animeCityName();
});

window.onload = async () => {
  const cityList = [
    "Houston",
    "Atlanta",
    "Honolulu",
    "Paris",
    "Belo Horizonte",
    "São Paulo",
  ];
  const randomCity = cityList[Math.round(Math.random() * cityList.length - 1)];
  console.log(randomCity);
  const coords = await getCoords(randomCity);
  await getWeather(coords);
  animeInfo();
  animeCityName();
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
});
