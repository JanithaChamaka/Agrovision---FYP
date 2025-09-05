// types/PredictionHistory.types.ts
import type { PredictionResult} from "./PredictionResult.types";

export interface PredictionHistory {
  city: string;
  month: string;
  fertilizer: string;
  predictions: PredictionResult;
  actions: PredictionResult["top_risks"];
 createdAt: string;
}

export interface SavePredictionResponse {
  success: boolean;
  data: PredictionHistory;
}
