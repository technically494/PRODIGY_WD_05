const apiKey = "30e42fd27464024a1c78c545b41c1ace";

const tempEl = document.getElementById("temp");
const descEl = document.getElementById("description");
const iconEl = document.getElementById("weather-icon");
const windEl = document.getElementById("wind");
const humidityEl = document.getElementById("humidity");
const cityEl = document.getElementById("city");
const dateEl = document.getElementById("date");

function getWeather(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) throw new Error("Weather data fetch failed");
      return response.json();
    })
    .then(data => {
      tempEl.innerHTML = `${Math.round(data.main.temp)}°C`;
      descEl.innerHTML = data.weather[0].description;
      windEl.innerHTML = `${data.wind.speed} km/h`;
      humidityEl.innerHTML = `${data.main.humidity}%`;

      const weather = data.weather[0].main.toLowerCase();
      setWeatherIcon(weather);

      const now = new Date();
      dateEl.innerHTML = now.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    })
    .catch(error => {
      console.error("Weather fetch error:", error);
      alert("Unable to fetch weather data.");
    });
}

function setWeatherIcon(weather) {
  const iconMap = {
    clear: "clear.png",
    clouds: "cloud.png",
    rain: "rain.png",
    thunderstorm: "thunder.png",
    snow: "snow.png"
  };
  const iconFile = iconMap[weather] || "cloud.png";
  iconEl.src = `assets/icons/${iconFile}`;
}

function getCityName(lat, lon) {
  const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
  fetch(geoUrl)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0 && data[0].name) {
        cityEl.innerHTML = data[0].name;
      } else {
        cityEl.innerHTML = "Unknown Location";
      }
    })
    .catch(() => {
      cityEl.innerHTML = "Unknown Location";
    });
}

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeather(lat, lon);
      getCityName(lat, lon);
    },
    error => {
      console.error("Geolocation error:", error);
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("Location access denied. Please allow it for weather updates.");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("Location unavailable. Please check your device settings.");
          break;
        case error.TIMEOUT:
          alert("Location request timed out.");
          break;
        default:
          alert("An unknown location error occurred.");
      }
    }
  );
} else {
  alert("Geolocation is not supported by your browser.");
}
