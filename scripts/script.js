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
    duration: 1000,
    easing: "easeOutElastic(1, .6)",
  });
};

const detailsAnimation = () => {
  anime({
    targets: ".infos li",
    opacity: [0, 1],
    translateY: [-30, 0],
    direction: "normal",
    delay: (el, i) => i * 100,
    easing: "easeOutElastic(1, .3)",
  });
};

async function getAndShowCityName(lon, lat, cityName) {
  const latLonApiKey = "b2c693299fe54c9abe92324f6bc7eddf";
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lon}&key=${latLonApiKey}`;

  const cityInfo = await fetch(url);
  const cityInfoData = await cityInfo.json();

  const cityNameTitle = document.querySelector(".city-name");

  cityNameTitle.innerText = `${cityName},
    ${cityInfoData.results[0].components.country}`;
}

async function getCoords(cityName) {
  const latLon = await fetch(urlLatLon(cityName));
  const latLonData = await latLon.json();
  const { lon, lat } = await latLonData.coord;
  getAndShowCityName(lon, lat, latLonData.name);
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

function getWeatherDetails({
  current: { humidity, clouds, wind_speed: windSpeed },
}) {
  const humidityEl = document.querySelector(".humidity");
  const cloudsEl = document.querySelector(".clouds");
  const windEl = document.querySelector(".wind");

  humidityEl.innerHTML = `<span>Humidade</span>${humidity}%`;
  cloudsEl.innerHTML = `<span>Nuvens</span>${clouds}%`;
  windEl.innerHTML = `<span>Vento</span>${(windSpeed * 3.6).toFixed(1)}Km/h`;
}

function getNextDaysForecast({ daily }) {
  const firstDate = new Date(daily[1].dt * 1000);
  const firstDateFormat = `${firstDate.toLocaleString("pt-BR", {
    day: "2-digit",
  })}/${firstDate.toLocaleString("pt-BR", { month: "2-digit" })}`;
  const secondDate = new Date(daily[2].dt * 1000);
  const secondDateFormat = `${secondDate.toLocaleString("pt-BR", {
    day: "2-digit",
  })}/${firstDate.toLocaleString("pt-BR", { month: "2-digit" })}`;
  const thirdDate = new Date(daily[3].dt * 1000);
  const thirdDateFormat = `${thirdDate.toLocaleString("pt-BR", {
    day: "2-digit",
  })}/${firstDate.toLocaleString("pt-BR", { month: "2-digit" })}`;
  const forthDate = new Date(daily[4].dt * 1000);
  const forthDateFormat = `${forthDate.toLocaleString("pt-BR", {
    day: "2-digit",
  })}/${firstDate.toLocaleString("pt-BR", { month: "2-digit" })}`;
  const fifthDate = new Date(daily[5].dt * 1000);
  const fifthDateFormat = `${fifthDate.toLocaleString("pt-BR", {
    day: "2-digit",
  })}/${firstDate.toLocaleString("pt-BR", { month: "2-digit" })}`;

  const primeiroEl = document.querySelector(".primeiro");
  const segundoEl = document.querySelector(".segundo");
  const terceiroEl = document.querySelector(".terceiro");
  const quartoEl = document.querySelector(".quarto");
  const quintoEl = document.querySelector(".quinto");

  primeiroEl.innerHTML = `<span>${firstDateFormat}</span>${String(
    daily[1].temp.day.toFixed(1)
  ).replace(".", ",")}ºC`;
  segundoEl.innerHTML = `<span>${secondDateFormat}</span>${String(
    daily[2].temp.day.toFixed(1)
  ).replace(".", ",")}ºC`;
  terceiroEl.innerHTML = `<span>${thirdDateFormat}</span>${String(
    daily[3].temp.day.toFixed(1)
  ).replace(".", ",")}ºC`;
  quartoEl.innerHTML = `<span>${forthDateFormat}</span>${String(
    daily[4].temp.day.toFixed(1)
  ).replace(".", ",")}ºC`;
  quintoEl.innerHTML = `<span>${fifthDateFormat}</span>${String(
    daily[5].temp.day.toFixed(1)
  ).replace(".", ",")}ºC`;
}

function showPage() {
  document.querySelector(".loader-wrapper").style.display = "none";
  document.querySelector(".container").style.display = "grid";
}

function showLoader() {
  document.querySelector(".loader-wrapper").style.display = "flex";
  setTimeout(() => {
    showPage();
  }, 2000);
}

async function getWeather({ lon, lat }) {
  const weatherInfo = await fetch(urlWeather(lat, lon));
  const weatherInfoData = await weatherInfo.json();
  showWeatherTemp(weatherInfoData);
  getAndShowTime(weatherInfoData);
  getWeatherDetails(weatherInfoData);
  getNextDaysForecast(weatherInfoData);
}

searchButton.addEventListener("click", async () => {
  const coords = await getCoords(searchInput.value);
  await getWeather(coords);
  showLoader();
  setTimeout(() => {
    animeInfo();
    animeCityName();
    detailsAnimation();
  }, 2000);
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
  const randomCity = cityList[Math.floor(Math.random() * cityList.length)];
  const coords = await getCoords(randomCity);
  await getWeather(coords);
  showLoader();

  setTimeout(() => {
    animeInfo();
    animeCityName();
    detailsAnimation();
  }, 2000);
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
});
