import config from './config.js'

// Object mapping weather descriptions to hexadecimal colors
const coloresPorClima = {
  "cielo claro": "#00E0E0",
  "algo de nubes": "#87CEEB",
  nubes: "#a0b4cc",
  "nubes dispersas": "#B0C4DE",
  "muy nuboso": "#808080",
  "lluvia ligera": "#C9C9A9",
  "lluvia moderada": "#696969",
  "lluvia intensa": "#2F4F4F",
  "lluvia fuerte": "#4682B4",
  tormenta: "#5353f0",
  'nevada ligera': "#DDDDDD",
  nieve: "#DDDDDD",
  niebla: "#D3D3D3",
  bruma: "#D3D3D3",
};

// API key to access weather data
const _apikey = config.apiKey;

// Language used for weather descriptions
const language = "es";


// DOM elements
const weatherDataEl = document.querySelector("#weather-data");
const formEl = document.querySelector("form");
const cityInputEl = document.querySelector("#city-input");

// Display weather data on page load
window.addEventListener("load", () => {
  const lastData = localStorage.getItem("lastData");
  if (!lastData) {
    getWeather("Lima,pe");
  } else {
    showData();
  }
});

// Event listener for form submission
formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = cityInputEl.value.trim().toLowerCase();
  if (cityName) {
    getWeather(cityName);
  }
});

// Fetch weather data from API
async function getWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather/?q=${city}&appid=${_apikey}&units=metric&lang=${language}`
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`${data.message}`);
    }
    localStorage.setItem("lastData", JSON.stringify(data));
    showData();
  } catch (error) {
    alert(error);
  }
}

// Function to display weather data from local storage
function showData() {
  // Get weather data from local storage
  const lastData = JSON.parse(localStorage.getItem("lastData"));
  if (!lastData) return;

  // Extract city, country, temperature, description, icon, and details
  const {
    name: city,
    sys: { country },
    main: { temp, feels_like, humidity },
    weather,
    wind: { speed },
  } = lastData;
  const { description, icon } = weather[0];
  const details = [
    `Sensacion T. <span>${Math.round(feels_like)}°C</span>`,
    `Humedad <span>${humidity} %</span>`,
    `Vel. Viento <span>${speed} m/s</span>`,
  ];

  const background = document.body;
  background.style.background = `linear-gradient(${coloresPorClima[description]} 10%, white 80%)`;
  weatherDataEl.querySelector("#city").innerText = `${city}, ${country}`;
  weatherDataEl.querySelector(
    "img"
  ).src = `http://openweathermap.org/img/wn/${icon}@4x.png`;

  weatherDataEl.querySelector("#degrees").innerText = `${Math.round(temp)}°C`;
  weatherDataEl.querySelector("#description").innerText = description;
  weatherDataEl
    .querySelector(".details-container")
    .querySelectorAll("div")
    .forEach((div, index) => {
      div.innerHTML = details[index];
    });
}
