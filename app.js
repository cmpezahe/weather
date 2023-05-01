const apikey = "b6f26a79ca773edd8d370c7c132cac30";

// const weatherDataEl = document.getElementById("weather-data");
let city = document.querySelector(".weather__city");
let datetime = document.querySelector(".weather__datetime");
const cityInputEl = document.getElementById("city-input");
const weatherDataEl = document.getElementById("weather-data");
const weatherBox = document.querySelector("icon");

const formEl = document.querySelector("form");

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const cityValue = cityInputEl.value;
  getWeatherData(cityValue);
});

function convertTimeStamp(timestamp, timezone) {
  const convertTimezone = timezone / 3600; // convert seconds to hours
  //! TEST
  const date = new Date(timestamp * 1000);

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: `Etc/GMT${convertTimezone >= 0 ? "-" : "+"}${Math.abs(
      convertTimezone
    )}`,
    hour12: true,
  };
  return date.toLocaleString("en-US", options);
}

// convert country code to name
function convertCountryCode(country) {
  let regionNames = new Intl.DisplayNames(["en"], {type: "region"});
  return regionNames.of(country);
}

async function getWeatherData(cityValue) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${apikey}&units=metric`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // const image = document.getElementById("weather-data img");
    // const image = document.querySelector(".weather-data img");
    const image = document.querySelector(".icon img");
    city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`;
    datetime.innerHTML = convertTimeStamp(data.dt, data.timezone);
    console.log(data);
    switch (data.weather[0].main) {
      case "Clear":
        image.src = "images/clear.png";
        break;

      case "Rain":
        image.src = "images/rain.png";
        break;

      case "Snow":
        image.src = "images/snow.png";
        break;

      case "Clouds":
        image.src = "images/cloud.png";
        break;

      case "Mist":
        image.src = "images/mist.png";
        break;

      default:
        image.src = "";
    }
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    console.log(temperature);

    weatherDataEl.querySelector(
      ".temperature"
    ).textContent = `${temperature}°C`;

    const details = [
      `Feels like: ${Math.round(data.main.feels_like)}°C`,
      `Humidity: ${data.main.humidity}%`,
      `Wind speed: ${data.wind.speed} m/s`,
      `Pressure: ${data.main.pressure}`,
    ];

    weatherDataEl.querySelector(".description").textContent = description;

    weatherDataEl.querySelector(".details").innerHTML = details
      .map((detail) => `<div>${detail}</div>`)
      .join("");
  } catch (error) {}
  const weatherBox = document.querySelector(".icon");
}
