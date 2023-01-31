import './App.css';
import CurrentWeather from './components/current-weather/current-weather';
import Search from './components/search/search';
import { WEATHER_API_URL, WEATHER_API_KEY } from './api';
import { useState } from 'react';
import Forecast from './components/forecast/forecast';
import axios from 'axios';

function App() {

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");
  
    Promise.all([
      axios.get(`${WEATHER_API_URL}/weather`, {
        params: {
          lat: lat,
          lon: lon,
          appid: WEATHER_API_KEY,
          units: "metric"
        }
      }),
      axios.get(`${WEATHER_API_URL}/forecast`, {
        params: {
          lat: lat,
          lon: lon,
          appid: WEATHER_API_KEY,
          units: "metric"
        }
      })
    ])
      .then(response => {
        const weatherResponse = response[0].data;
        const forecastResponse = response[1].data;
        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecast && <Forecast data={forecast}/>}
    </div>
  );
}

export default App;
