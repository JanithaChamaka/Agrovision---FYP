export type PredictionResult = {
  disease_percentage: number;
  top_risks: Array<Risk>;
  notes: string;
};

export interface Risk {
  name: string;
  risk_score: number;
  why: string;
  actions: string[];
  refs: string[];
}
