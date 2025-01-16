import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from 'react';
import weatherService from '../weatherService';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: [{
    description: string;
  }];
}

interface CityData {
    name: string;
    coord: {
        lat: number;
        lon: number;
    };
    main: {
        temp: number;
    };
    weather: [{
        description: string;
    }];
}


export const meta: MetaFunction = () => {
  return [{ title: "Weather App" }];
};

export default function Index() {
  const [location, setLocation] = useState<{ lat: number | null, lon: number | null }>({ lat: null, lon: null });
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [nearbyCities, setNearbyCities] = useState<CityData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        console.log("Location fetched:", position.coords.latitude, position.coords.longitude);
                        setLocation({
                            lat: position.coords.latitude,
                            lon: position.coords.longitude,
                        });
                    },
                    (error) => {
                        console.error("Error fetching location:", error.message);
                        setError(error.message);
                    }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
                setError("Geolocation is not supported by this browser.");
            }
        };

        getLocation();
    }, []);


  useEffect(() => {
    const fetchWeatherData = async () => {
        console.log("Fetching weather data with location:", location);
        if (location.lat && location.lon) {
            setLoading(true);
            setError(null);
            try {
                const weather = await weatherService.fetchWeatherByCoords(location.lat, location.lon);
                console.log("Weather data fetched:", weather);
                setWeatherData(weather as WeatherData);
                const nearby = await weatherService.fetchNearbyCities(location.lat, location.lon);
                console.log("Nearby cities fetched:", nearby);
                setNearbyCities(nearby.list as CityData[]);
            } catch (err: unknown) {
                console.error("Error fetching weather data:", err);
                if (err instanceof Error) {
                    setError(err.message || 'Failed to fetch weather data');
                } else {
                    setError('An unknown error occurred');
                }
                setWeatherData(null);
                setNearbyCities(null);
            } finally {
                setLoading(false);
            }
        }
    };

    fetchWeatherData();
  }, [location]);


  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold mb-4 text-center">Weather App</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {loading && <p className="text-center">Loading...</p>}
        {weatherData ? (
            <div className="bg-white p-8 rounded shadow-md w-96 mb-4">
                <h2 className="text-xl font-semibold mb-2 text-center">{weatherData.name}</h2>
                <p className="text-center">Temperature: {weatherData.main.temp}°C</p>
                <p className="text-center">Humidity: {weatherData.main.humidity}%</p>
                <p className="text-center">Wind Speed: {weatherData.wind.speed} m/s</p>
                <p className="text-center">Conditions: {weatherData.weather[0].description}</p>
            </div>
        ) : null}
        {nearbyCities ? (
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-xl font-semibold mb-2 text-center">Nearby Cities</h2>
                <ul>
                    {nearbyCities.map((city) => (
                        <li key={city.name} className="mb-2">
                            <h3 className="font-semibold">{city.name}</h3>
                            <p>Temperature: {city.main.temp}°C</p>
                            <p>Conditions: {city.weather[0].description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        ) : null}
    </div>
  );
}
