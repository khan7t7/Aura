import axios from 'axios';

const API_KEY = "edb40bd37610cc801645a9236e0c1069"; // Replace with your API key

const weatherService = {
  async fetchWeather(city) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  },
  async fetchWeatherByCoords(lat, lon) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data by coordinates:', error);
      throw error;
    }
  },
  async fetchNearbyCities(lat, lon) {
      try {
          const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=10&appid=${API_KEY}&units=metric`
          );
          return response.data;
      } catch (error) {
          console.error('Error fetching nearby cities:', error);
          throw error;
      }
  }
};

export default weatherService;
