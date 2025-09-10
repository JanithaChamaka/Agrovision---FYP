import axios from "axios";
import type { PredictionResult } from "../types/PredictionResult.types";
import type { SavePredictionResponse } from "../types/PredictionHistory.types";

export const savePrediction = async (
 userid: string,
  prediction: PredictionResult,
  city: string,
  month: string,
  fertilizer: string
): Promise<SavePredictionResponse> => {
  const token = localStorage.getItem("token");
  const userId = userid;
  const crop = "paddy";
  const payload = {
    userId,                              
    crop,                                
    diseasePercentage: prediction.disease_percentage, 
    city,
    month,
    fertilizer,
    actions: prediction.top_risks.map(r => ({
      name: r.name,
      riskScore: r.risk_score,
      why: r.why,
      actions: r.actions,
      refs: r.refs || [],
    })),
    notes: prediction.notes || "",
  };
console.log("Payload:", payload);
  const res = await axios.post("http://localhost:5000/api/predictions", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
