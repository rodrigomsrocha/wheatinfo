const apiKey = "3c3b648ddb3385500b31cf35f9aa2167";
const urlLatLon = (cityName) =>
  `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
const urlWeather = (lat, lon) =>
  `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely&lang=pt_br&appid=${apiKey}`;
const searchButton = document.querySelector("button");
const searchInput = document.querySelector(".location");
const form = document.querySelector(".search");

async function getCoords(cityName) {
  const latLon = await fetch(urlLatLon(cityName));
  const latLonData = await latLon.json();
  const { lon, lat } = await latLonData.coord;
  getAndShowCityName(lon, lat);
  return { lon, lat };
}

async function getAndShowCityName(lon, lat) {
  const apiKey = "b2c693299fe54c9abe92324f6bc7eddf";
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lon}&key=${apiKey}`;

  const cityInfo = await fetch(url);
  const cityInfoData = await cityInfo.json();

  const inputValue = searchInput.value;

  const cityNameTitle = document.querySelector(".city-name");

  cityNameTitle.innerText = `${
    inputValue.indexOf(" ") > 0
      ? inputValue.split(" ")[0].charAt(0).toUpperCase() +
        inputValue.slice(1, inputValue.indexOf(" ")) +
        " " +
        inputValue.split(" ")[1].charAt(0).toUpperCase() +
        inputValue.slice(inputValue.indexOf(" ") + 2)
      : inputValue.charAt(0).toUpperCase() + inputValue.slice(1)
  },
      ${cityInfoData.results[0].components.country}`;
}

async function getWeather({ lon, lat }) {
  const weatherInfo = await fetch(urlWeather(lat, lon));
  const weatherInfoData = await weatherInfo.json();
  showWeatherTemp(weatherInfoData);
}

function showWeatherTemp({ current, current: { weather } }) {
  const temperature = document.querySelector(".temperature");
  const weatherName = document.querySelector(".weather-name");
  const weatherImg = document.querySelector(".weather-description img");

  console.log(weather, current);
  temperature.innerText = `${current.temp.toFixed(1)}ºC`;
  weatherName.innerText = weather[0].description;
  weatherImg.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
}

searchButton.addEventListener("click", async (e) => {
  const coords = await getCoords(searchInput.value);
  getWeather(coords);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
});
