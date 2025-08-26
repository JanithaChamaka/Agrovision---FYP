import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import CityDropdown from "../components/CityDropdown";
import fetchPredictions from "../services/fetchpredictions";
import { getWeatherAverages } from "../services/fetchweatherData";
import type { PredictionResult } from "../types/PredictionResult.types";
import type { WeatherDisplay } from "../types/WeatherDisplay.types";
import { ArrowLeft } from "lucide-react";
import footerImage from "../assets/images/footer1.png";
import { toast } from "react-toastify";

const UserInputPage = () => {
  const [view, setView] = useState<"idle" | "rainfall" | "prediction">("idle");
  const [city, setCity] = useState("");
  const [fertilizer, setFertilizer] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherDisplay | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [predictError, setPredictError] = useState<string | null>(null);

  const monthShort = useMemo(
    () => new Date().toLocaleString("default", { month: "long" }).slice(0, 3),
    []
  );
  const [showCard, setShowCard] = useState(true);
  // Load weather data when city changes
  useEffect(() => {
    if (!city) {
      setWeatherData(null);
      setView("idle");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoadingWeather(true);
        setWeatherError(null);
        const raw = await getWeatherAverages(city);
        if (cancelled) return;

        const parsed: WeatherDisplay | null = raw
          ? {
            avg_rainfall: Number(raw.avg_rainfall),
            avg_humidity: Number(raw.avg_humidity),
            avg_temperature: Number(raw.avg_temperature),
          }
          : null;

        if (!parsed) {
          setWeatherError("Weather data unavailable for the selected city.");
          setWeatherData(null);
          setView("idle");
        } else {
          setWeatherData(parsed);
          setView("rainfall");
        }
      } catch (err) {
        console.error(err);
        setWeatherError("Failed to load weather data. Please try again.");
        setWeatherData(null);
        setView("idle");
      } finally {
        setLoadingWeather(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [city]);

  // Predict disease risk
  const onPredict = async () => {
    if (!city || !weatherData) return;
    if (!fertilizer) {
      setPredictError("Please enter fertilizer usage (kg) before predicting.");
      return;
    }
    try {
      setPredictError(null);
      setPredicting(true);
      const result = await fetchPredictions({
        town: city,
        month: monthShort,
        avg_rainfall: weatherData.avg_rainfall,
        avg_humidity: weatherData.avg_humidity,
        avg_temperature: weatherData.avg_temperature,
        fertilizer_usage: parseFloat(fertilizer),
      });
      setPrediction(result);
      setView("prediction");
    } catch (err) {
      console.error(err);
      setPredictError("Could not fetch prediction. Please try again.");
      setPrediction(null);
    } finally {
      setPredicting(false);
    }
  };

  const onBack = () => {
    setView("rainfall");
    setPredictError(null);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 via-blue-50 to-emerald-100 p-4 md:p-8 flex flex-col items-center">
        <div className="absolute bottom-0 left-0 w-full">
    <img
      src={footerImage} 
      alt="Footer"
      className="w-full object-cover opacity-80"
    />
  </div>
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full text-center mt-12"
      >
        <h1 className="text-6xl md:text-7xl font-extrabold text-[#254336]">Agrovision</h1>
        <p className="text-xl md:text-xl text-emerald-700 mt-4">
          Harnessing AI to Predict, Protect, and Prosper in Farming!
        </p>
      </motion.div>

      {/* Input Form Card */}
      {showCard && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 w-full max-w-[600px] h-90 bg-white shadow-2xl rounded-3xl p-10 flex flex-col items-center gap-8"
        >
          <CityDropdown
            city={city}
            setCity={(value) => {
              setCity(value);
              setFertilizer("");
              setPrediction(null);
              setPredictError(null);
            }}
          />
          <input
            value={fertilizer}
            onChange={(e) => {
              const value = e.target.value;
              // ✅ allow only numbers >= 0
              if (value === "" || (/^\d+$/.test(value) && Number(value) >= 0)) {
                setFertilizer(value);
              }
              else {
                toast.error("Only numbers are allowed 🚫");
              }
            }}
            placeholder="Fertilizer (kg)"
            type="number"
            min={0}
            className="w-full text-xl px-5 py-4 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            disabled={!city || !weatherData || predicting}
            onClick={() => {
              onPredict();          // call your prediction function
              setShowCard(false);    // show the card after clicking
            }}
            className={`w-full text-xl px-6 py-4 rounded-lg shadow-lg font-semibold transition ${!city || !weatherData || predicting
              ? "bg-emerald-300 text-white cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
          >
            {predicting ? "Predicting..." : "Predict Disease Risk"}
          </button>

          {predictError && (
            <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-700 text-center w-full">
              {predictError}
            </div>
          )}
        </motion.div>
      )}


      {/* Loading
      {loadingWeather && (
        <div className="rounded-2xl bg-white shadow-2xl p-10 text-center text-emerald-700 mt-12">
          Loading weather & dashboards…
        </div>
      )} */}

      {/* Prediction View */}
      {view === "prediction" && prediction && weatherData && (
        <motion.div
          key="prediction"
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
          className="grid grid-cols-1 gap-8 mt-12 w-full max-w-7xl"
        >

          {/* Disease Risk Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl bg-white shadow p-8"
          >
            <button
              onClick={() => {
                onBack();
                setShowCard(true);
              }}
              className="mt-6 p-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 shadow transition flex items-center justify-center"
              title="Back to Weather"
            >
              <ArrowLeft size={10} />
            </button>
            <p className="text-sm text-gray-500">Predicted Disease Risk</p>
            <h2 className="text-5xl font-extrabold text-rose-600 mt-4">{prediction.disease_percentage}%</h2>
            <p className="text-sm text-gray-600 mt-2">
              Based on <span className="font-semibold">{city}</span>, {monthShort} weather & fertilizer.
            </p>
            <h2 className="text-2xl font-bold text-emerald-800 mb-6">Top Risks</h2>
            <div className="space-y-5">
              {prediction.top_risks.map((risk: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, rotateY: -90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="rounded-xl border border-gray-200 shadow-sm p-6 bg-gradient-to-br from-white to-emerald-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{risk.name}</h3>
                    <span
                      className={`px-3 py-1 text-sm rounded-full font-medium ${risk.risk_score > 75
                        ? "bg-rose-100 text-rose-700"
                        : risk.risk_score > 40
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                        }`}
                    >
                      {risk.risk_score}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium text-gray-700">Why: </span>
                    {risk.why}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium text-gray-700">Actions: </span>
                    {risk.actions}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Idle state */}
      {/* {view === "idle" && !loadingWeather && (
        <div className="rounded-2xl bg-white shadow-2xl p-10 text-center text-emerald-700 mt-12">
          Select a city to view the weather dashboards.
        </div>
      )} */}
      {/* <div className="w-full flex justify-center mt-auto">
  <img
    src={footerImage}
    alt="Footer"
    className="w-full max-w-screen-lg object-contain"
  />
</div> */}
    </div>
  );
};

export default UserInputPage;
