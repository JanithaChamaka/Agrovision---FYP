import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";
import fetchPredictions from "../services/fetchpredictions";
import type { PredictionResult } from "../types/PredictionResult.types";
import CityDropdown from "../components/CityDropdown";
import { getWeatherAverages } from "../services/fetchweatherData";
import type { WeatherDisplay } from "../types/WeatherDisplay.types";

const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28"];

type PredictionData = {
  name: string;
  value: number;
}[];

const UserInputPage = () => {
  const [city, setCity] = useState("");
  const [fertilizer, setFertilizer] = useState("");
  const [chartData, setChartData] = useState<PredictionData | null>(null);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const month = new Date()
    .toLocaleString("default", { month: "long" })
    .slice(0, 3);
  const [weatherData, setWeatherData] = useState<WeatherDisplay | null>(null);

  // Step 1: Get prediction and show chart
  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setStatusMessage("Fetching weather data...");
      const rawWeatherData = await getWeatherAverages(city);

      const weatherData: WeatherDisplay | null = rawWeatherData
        ? {
            avg_rainfall: Number(rawWeatherData.avg_rainfall),
            avg_humidity: Number(rawWeatherData.avg_humidity),
            avg_temperature: Number(rawWeatherData.avg_temperature),
          }
        : null;

      setWeatherData(weatherData);

      if (!weatherData) {
        setStatusMessage(null);
        return;
      }

      setStatusMessage("Fetching prediction...");
      const data = await fetchPredictions({
        town: city,
        month: month,
        avg_rainfall: weatherData.avg_rainfall,
        avg_humidity: weatherData.avg_humidity,
        avg_temperature: weatherData.avg_temperature,
        fertilizer_usage: parseFloat(fertilizer),
      });
      setPrediction(data);
      setStatusMessage(null);
    } catch (e) {
      console.error("Error sending report:", e);
      setStatusMessage("Something went wrong. Please try again.");
    }
  };

  // Step 2: Send email with chart data
  const handleSendReport = async () => {
    await fetch("/api/send-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, city, fertilizer, chartData }),
    });
    alert("Report sent!");
  };

  return (
    <div
      className="flex justify-center mt-40"
      style={{ width: "100vw", height: "80vh" }}
    >
      <div className="bg-gray-50 p-6 rounded-lg shadow-lg w-[70vw] h-[75vh] flex flex-col items-center gap-6">
        {/* Step 1: City + Fertilizer Form */}
        {step === 1 && (
          <>
            <form
              onSubmit={handlePredict}
              className="flex flex-col gap-4 w-full max-w-md"
            >
              <CityDropdown
                city={city}
                setCity={(value) => {
                  setCity(value);
                  setStatusMessage("Click Predict to get a new prediction");
                }}
              />
              <input
                value={fertilizer}
                onChange={(e) => {
                  setFertilizer(e.target.value);
                  setStatusMessage("Click Predict to get a new prediction");
                }}
                placeholder="Fertilizer Usage (kg)"
                type="number"
                className="border rounded px-3 py-2"
                required
              />
              <button
                type="submit"
                className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Predict
              </button>
            </form>
            {/*output display*/}
            <div className="w-[500px] h-[500px] border border-black flex justify-center items-center rounded-lg">
              {statusMessage ? (
                <p>{statusMessage}</p>
              ) : prediction ? (
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-4">Prediction Result</h2>
                  <p>City: {city}</p>
                  <p>Month: {month}</p>
                  <p>Average temperature: {weatherData?.avg_temperature} °C</p>
                  <p>Average humidity: {weatherData?.avg_humidity} %</p>
                  <p>Average rainfall: {weatherData?.avg_rainfall} mm</p>
                  <p>Fertilizer Usage: {fertilizer} kg</p>
                  <div className="mt-3 text-xl flex flex-col">
                    <p>Predicted Disease Percentage</p>
                    <p> {prediction.disease_percentage} %</p>
                  </div>
                </div>
              ) : (
                <p>No prediction available.</p>
              )}
            </div>
          </>
        )}

        {/* Step 2: Show Pie Chart + Email Input */}
        {step === 2 && chartData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            <PieChart width={400} height={300}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>

            <div className="flex gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                type="email"
                className="border rounded px-3 py-2"
                required
              />
              <button
                onClick={handleSendReport}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Send Report
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserInputPage;
