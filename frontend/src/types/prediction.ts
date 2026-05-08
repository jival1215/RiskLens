export type RiskLevel = "Low Risk" | "Medium Risk" | "High Risk";
export type ReviewStatus = "Unreviewed" | "Reviewed" | "Confirmed Risk" | "False Positive";

export interface Prediction {
  prediction_id: number;
  upload_id: number;
  applicant_id: string;
  loan_amnt: number;
  annual_inc: number;
  default_probability: number;
  risk_level: RiskLevel;
  recommendation: string;
  review_status: ReviewStatus;
  created_at: string;
}

export interface UploadResult {
  id: number;
  filename: string;
  row_count: number;
  created_at: string;
  predictions: Prediction[];
  message: string;
}
