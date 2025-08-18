import axios from "axios";
import { WEATHER_URL } from "./config";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export const getWeatherAverages = async (town:string) => {
  try {
    const response = await axios.get(WEATHER_URL, {
      params: {
        key: API_KEY,
        q: town,
        days: 14,
        aqi: "no",
        alerts: "no",
        hour: 12
      }
    });

    const forecastDays = response.data.forecast.forecastday;

    let totalRain = 0, totalTemp = 0, totalHumidity = 0;

    forecastDays.forEach((day: { day: { totalprecip_mm: number; avgtemp_c: number; avghumidity: number; }; }) => {
      totalRain += day.day.totalprecip_mm;
      totalTemp += day.day.avgtemp_c;
      totalHumidity += day.day.avghumidity;
    });

    const count = forecastDays.length;

    return {
      avg_rainfall: (totalRain / count).toFixed(2),
      avg_temperature: (totalTemp / count).toFixed(2),
      avg_humidity: (totalHumidity / count).toFixed(2),
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}