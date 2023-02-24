// select elements
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

// app data
const weather = {};

weather.temperature = {
  unit: "celsius",
};

const KELVIN = 273;
const key = "82005d27a116c2880c8f0fcb866998a0";

// check support
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "<p>Browser doesn't support geolocation</p>";
}

function setPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  getWeather(latitude, longitude);
}

function showError(error) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p>${error.message}</p>`;
}

async function getWeather(latitude, longitude) {
  const api = `https://cors-anywhere.herokuapp.com/HTTP://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
  const response = await fetch(api);
  const data = await response.json();

  weather.temperature.value = Math.floor(data.main.temp - KELVIN);
  weather.description = data.weather[0].description;
  weather.iconId = data.weather[0].icon;
  weather.sity = data.name;
  weather.country = data.sys.country;

  displayWeather();
}

function displayWeather() {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png" alt="weather-icon">`;
  tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.sity}, ${weather.country}`;
}

function celsiusToFahrenheit(celsius) {
  return Math.floor((celsius * 9) / 5 + 32);
}

tempElement.addEventListener("click", function (e) {
  if (weather.temperature.value === undefined) return;

  if (weather.temperature.unit === "celsius") {
    const fahrenheit = celsiusToFahrenheit(weather.temperature.value);
    tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
    weather.temperature.unit = "fahrenheit";
  } else {
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    weather.temperature.unit = "celsius";
  }
});
