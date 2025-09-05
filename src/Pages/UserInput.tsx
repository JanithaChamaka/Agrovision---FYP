import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import CityDropdown from "../components/CityDropdown";
import fetchPredictions from "../services/fetchpredictions";
import { getWeatherAverages } from "../services/fetchweatherData";
import type { WeatherDisplay } from "../types/WeatherDisplay.types";
import { ArrowLeft } from "lucide-react";
import type { PredictionResult, Risk } from "../types/PredictionResult.types";
import emailjs from "emailjs-com";
import AuthBg from "../assets/images/jetwing-footer.jpg";
import toast from "react-hot-toast";
import PDFDocument from "../components/PDFDocument";
import { PDFDownloadLink } from "@react-pdf/renderer";
import type { SavePredictionResponse } from "../types/prediction";
import { savePrediction } from "../services/serverPrediction";
import { useAuthStore } from "../store/useAuthStore";
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
  const [history, setHistory] = useState<SavePredictionResponse[]>([]);
  const { authUser } = useAuthStore();
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
    console.log("Predicting disease risk...");
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
      console.log(result);
      setView("prediction");// from login
      if (authUser) {
        const saved = await savePrediction(authUser._id, result, city, monthShort, fertilizer);
        console.log(result);
        console.log("Saved prediction:", saved);
        toast.success("Prediction saved successfully!", { position: "top-center" });
      }
      else {
        toast.error("You must be logged in to save predictions.", { position: "top-center" });
      }
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

  const sendEmail = async (
    prediction: PredictionResult,
    city: string,
    month: string,
    fertilizer: string
  ) => {
    try {
      await emailjs.send(
        "service_nkcqtfh",
        "template_fcoix4s",
        {
          city,
          month,
          fertilizer,
          disease_percentage: prediction.disease_percentage,
          risks: prediction.top_risks
            .map((r) => `${r.name} - ${r.risk_score}`)
            .join(", "),
        },
        "e-Ag0WU12ctWFr3Oe"
      );
      toast.success("Email sent successfully!", { position: "top-center" });
    } catch (err) {
      console.error("EmailJS error:", err);
      toast.error("Failed to send email.");
    }
  };

  return (
    <div
      className="min-h-screen relative w-full bg-gradient-to-br from-green-100 via-blue-50 to-emerald-100 p-4 md:p-8 flex flex-col items-center"
      style={{
        backgroundImage: `url(${AuthBg})`,
        backgroundSize: "cover",
      }}
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full text-center mt-12"
      >
        <h1 className="text-6xl md:text-7xl font-extrabold text-[#254336]">
          Agrovision
        </h1>
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
          className="mt-12 w-full max-w-[600px] h-90 bg-white shadow-2xl rounded-3xl p-10 flex flex-col items-center gap-8 z-20"
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
              if (value === "" || (/^\d+$/.test(value) && Number(value) >= 0)) {
                setFertilizer(value);
              }
            }}
            placeholder="Fertilizer (kg)"
            type="number"
            min={0}
            className="w-full text-xl px-5 py-4 border rounded-lg shadow-md focus:outline-none"
          />
          <button
            onClick={() => {
              if (!city) {
                toast.error("Please select a city!", { position: "top-center" });
                return;
              }
              if (!fertilizer) {
                toast.error("Please enter fertilizer amount!", {
                  position: "top-center",
                });
                return;
              }
              onPredict();
              setShowCard(false);
            }}
            className={`w-full text-xl px-6 py-4 rounded-lg shadow-lg font-semibold transition ${!city || !fertilizer || predicting
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
<div className="mt-6">
  <button
    onClick={() => window.location.href = "/history"}
    className="w-[120px] py-2 text-white bg-[#254336] rounded-lg hover:bg-green-600 transition"
  >
    Show History
  </button>
</div>
      {/* Prediction View */}
      {view === "prediction" && prediction && weatherData && (
        <motion.div
          key="prediction"
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
          className="flex flex-col gap-8 mt-12 w-full max-w-7xl"
        >
          {/* Buttons */}
          <div className="flex justify-between items-center mt-6">
            {/* Back button */}
            <button
              onClick={() => {
                onBack();
                setShowCard(true);
              }}
              title="Back to Weather"
              className="flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>

            {/* Download + Email buttons */}
            <div className="flex gap-4">
              {prediction && (
                <PDFDownloadLink
                  document={
                    <PDFDocument
                      prediction={prediction}
                      city={city}
                      month={monthShort}
                      fertilizer={fertilizer}
                    />
                  }
                  fileName={`prediction-${city}-${monthShort}.pdf`}
                >
                  {({ loading }) => (
                    <button className="w-[120px] py-2 text-white bg-[#254336] rounded-lg hover:bg-green-600 transition">
                      {loading ? "Generating..." : "Download PDF"}
                    </button>
                  )}
                </PDFDownloadLink>
              )}
              <button
                onClick={() => sendEmail(prediction, city, monthShort, fertilizer)}
                className="w-[120px] py-2 text-white bg-[#254336] rounded-lg hover:bg-green-600 transition"
              >
                Send Email
              </button>
            </div>
          </div>

          {/* Disease Percentage Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl bg-white shadow-lg p-8 text-center"
          >
            <p className="text-sm text-gray-500">Predicted Disease Risk</p>
            <h2 className="text-6xl font-extrabold text-rose-600 mt-4">
              {prediction.disease_percentage}%
            </h2>
            <p className="text-md text-gray-600 mt-2">
              Based on <span className="font-semibold">{city}</span>, {monthShort} weather & fertilizer.
            </p>
          </motion.div>

          {/* Top Risks Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {prediction.top_risks.map((risk: Risk, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="rounded-xl border border-gray-200 shadow p-6 bg-white"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{risk.name}</h3>
                <p className="text-md text-gray-600 mb-2">
                  <span className="font-medium text-gray-700">Why: </span>
                  {risk.why}
                </p>
                <p className="text-md text-gray-600">
                  <span className="font-medium text-gray-700">Actions: </span>
                  {risk.actions}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserInputPage;


