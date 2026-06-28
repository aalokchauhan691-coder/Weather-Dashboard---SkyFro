import "./App.css";
import WeatherAnimation from "./WeatherAnimation";
import { useState, useEffect } from "react";
import {
  getWeather,
  getForecast,
  getWeatherByCoords,
  getForecastByCoords,
  getAQI
} from "./weatherApi";

function App() {
  const [loading, setLoading] = useState(false);
  const today = new Date().toDateString();
  const [background, setBackground] = useState("clear");
  const [aqi, setAqi] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (city.trim() === "") {
      setError("Please enter a city name.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await getWeather(city);
      
      
      if (data.cod === "404") {
        setError("City not found!");
        setWeather(null);
        setForecast([]);
        return;
      }
      setWeather(data);

      let cities = JSON.parse(localStorage.getItem("recentCities")) || [];

      cities = cities.filter(
        (item) => item.toLowerCase() !== data.name.toLowerCase()
      );

      cities.unshift(data.name);

      cities = cities.slice(0, 5);

      localStorage.setItem("recentCities", JSON.stringify(cities));

      setRecentSearches(cities);

      const { lat, lon } = data.coord;

      const aqiData = await getAQI(lat, lon);
      setAqi(aqiData);

      setBackground(data.weather[0].main.toLowerCase());

      const forecastData = await getForecast(city);
      setForecast(forecastData.list);

          } catch (error) {
      
      setError("City not found!");
    }
    finally {
      setLoading(false);
    }
  };
  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setLoading(true);

          const { latitude, longitude } = position.coords;

          const weatherData = await getWeatherByCoords(latitude, longitude);
          setWeather(weatherData);
          setBackground(weatherData.weather[0].main.toLowerCase());

          const aqiData = await getAQI(latitude, longitude);
          setAqi(aqiData);

          const forecastData = await getForecastByCoords(latitude, longitude);
          setForecast(forecastData.list);

          setCity(weatherData.name);
          setError("");
        } catch (error) {
          setError("Unable to fetch location weather.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location permission denied.");
      }
    );
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }
  const getAqiLabel = (aqiValue) => {
    switch (aqiValue) {
      case 1:
        return "🟢 Good";
      case 2:
        return "🟡 Fair";
      case 3:
        return "🟠 Moderate";
      case 4:
        return "🔴 Poor";
      case 5:
        return "🟣 Very Poor";
      default:
        return "N/A";
    }
  };
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recentCities")) || [];
    setRecentSearches(saved);
  }, []);
  return (
    <div className={`app ${background}`}>
      <WeatherAnimation icon={weather?.weather[0]?.icon} />
      <div className="container">

        {/* Header */}
        <header className="header">
      <h1 className="app-title">
  <img src="/logo.png" alt="SkyFro Logo" className="logo" />
  SkyFro
</h1>

          <div className="search-box">
            <input
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleSearch} disabled={loading}>{loading ? "Searching..." : "Search"}
            </button>
            <button className="location-btn" onClick={handleLocation}>
              📍 Current location
            </button>
          </div>
          {recentSearches.length > 0 && (
  <div className="recent-searches">
    <p>Recent Searches:</p>

    {recentSearches.map((cityName, index) => (
      <button
        key={index}
        onClick={() => {
          setCity(cityName);
          setTimeout(() => handleSearch(), 0);
        }}
      >
        {cityName}
      </button>
    ))}
  </div>
)}
          {error && <p className="error">{error}</p>}
        </header>

        {/* Current Weather */}
        <section className="weather-card">

          <div className="weather-top">
            <h2>{weather?.name || "New Delhi"}</h2>
            <p>{today}</p>
          </div>

          <div className="weather-main">
            <img
              src={
                weather
                  ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
                  : "https://openweathermap.org/img/wn/01d@2x.png"
              }
              alt="weather icon"
            />

            <div>
              <h1>{weather ? Math.round(weather.main.temp) : 32}°C</h1>
              <p>{weather?.weather[0]?.description || "Clear Sky"}</p>
            </div>
          </div>

          <div className="weather-details">
            <div>
              <h4>Air Quality</h4>
              <p>
                {aqi?.list?.[0]?.main?.aqi
                  ? `${aqi.list[0].main.aqi} - ${getAqiLabel(aqi.list[0].main.aqi)}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <h4>Humidity</h4>
              <p>{weather?.main?.humidity || 65}%</p>
            </div>

            <div>
              <h4>Wind</h4>
              <p>
                {weather ? (weather.wind.speed * 3.6).toFixed(1) : 12} km/h
              </p>
            </div>

            <div>
              <h4>Pressure</h4>
              <p>{weather?.main?.pressure || 1012} hPa</p>
            </div>

            <div>
              <h4>Feels Like</h4>
              <p>{weather ? Math.round(weather.main.feels_like) : 35}°C</p>
            </div>
            <div>
              <h4>🌅 Sunrise</h4>
              <p>
                {weather
                  ? new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  : "--"}
              </p>
            </div>

            <div>
              <h4>🌇 Sunset</h4>
              <p>
                {weather
                  ? new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  : "--"}
              </p>
            </div>
          </div>

        </section>
        {/* Hourly Forcast */}
        <section className="hourly-forecast">
          <h2>Today's Hourly Forecast</h2>

          <div className="hourly-container">
            {forecast.slice(0, 8).map((item, index) => (
              <div className="hourly-card" key={index}>
                <h4>
                  {new Date(item.dt * 1000).toLocaleTimeString([], {
                    hour: "numeric",
                    hour12: true,
                  })}
                </h4>
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                  alt="weather"
                />

                <p>{Math.round(item.main.temp)}°C</p>
              </div>
            ))}
          </div>
        </section>

        {/* Forecast */}
        <section className="forecast">

          <h2>5-Day Forecast</h2>

          <div className="forecast-container">

            {forecast
              .filter((_, index) => index % 8 === 0)
              .slice(0, 5)
              .map((item, index) => (
                <div className="forecast-card" key={index}>

                  <h3>
                    {new Date(item.dt * 1000).toLocaleDateString(
                      "en-US",
                      { weekday: "short" }
                    )}
                  </h3>

                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                    alt="weather icon"
                  />

                  <p>{Math.round(item.main.temp)}°C</p>
                  <small>{item.weather[0].main}</small>

                </div>
              ))}

          </div>
        </section>
      </div>
    </div >
  );
}

export default App;