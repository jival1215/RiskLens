import axios from "axios";
import type { Prediction, ReviewStatus, UploadResult } from "../types/prediction";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export async function uploadApplicants(file: File, onProgress?: (progress: number) => void) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<UploadResult>("/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (event.total && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    },
  });
  return response.data;
}

export async function fetchPredictions(uploadId?: number) {
  const url = uploadId ? `/uploads/${uploadId}/predictions` : "/predictions";
  const response = await api.get<Prediction[]>(url);
  return response.data;
}

export async function updatePredictionStatus(predictionId: number, reviewStatus: ReviewStatus) {
  const response = await api.patch<Prediction>(`/predictions/${predictionId}/status`, {
    review_status: reviewStatus,
  });
  return response.data;
}

export function exportUrl(uploadId: number, scope: "all" | "high-risk" = "all") {
  return `${API_BASE_URL}/uploads/${uploadId}/export?scope=${scope}`;
}
