import axios from "axios";

export const BASE_URL = "http://127.0.0.1:8000";
export const WEATHER_URL = "https://api.weatherapi.com/v1/forecast.json";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});
