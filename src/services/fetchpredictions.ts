import axios from "axios";
import type { FetchPredictionsParams } from "../types/FetchPredictionsParams.types";
import { BASE_URL } from "./config";

const fetchPredictions = async ({
  town,
  month,
  avg_rainfall,
  avg_humidity,
  avg_temperature,
  fertilizer_usage,
}: FetchPredictionsParams) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/predict`,
      {
        town,
        month,
        avg_rainfall,
        avg_humidity,
        avg_temperature,
        fertilizer_usage,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    
    return response.data;
  } catch {
    throw new Error("Error fetching predictions");
  }
};

export default fetchPredictions;