import { Download, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { exportUrl, fetchPredictions } from "../api/client";
import { PredictionsTable } from "../components/PredictionsTable";
import { RiskDistributionChart } from "../components/RiskDistributionChart";
import { RiskScoreHistogram } from "../components/RiskScoreHistogram";
import { SummaryCards } from "../components/SummaryCards";
import type { Prediction } from "../types/prediction";

export function Dashboard() {
  const [searchParams] = useSearchParams();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const queryUploadId = searchParams.get("uploadId");
  const storedUploadId = localStorage.getItem("risklens:lastUploadId");
  const uploadId = queryUploadId ? Number(queryUploadId) : storedUploadId ? Number(storedUploadId) : undefined;

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchPredictions(uploadId);
      setPredictions(data);
      if (uploadId) localStorage.setItem("risklens:lastUploadId", String(uploadId));
    } catch {
      setError("Could not load predictions. Confirm the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [uploadId]);

  const activeUploadId = useMemo(() => predictions[0]?.upload_id ?? uploadId, [predictions, uploadId]);

  const onUpdated = (updated: Prediction) => {
    setPredictions((current) =>
      current.map((prediction) => (prediction.prediction_id === updated.prediction_id ? updated : prediction)),
    );
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Monitoring dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">Transaction risk scores</h1>
          <p className="mt-2 text-slate-600">Model probability, risk bands, review workflow, and analyst exports.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={load}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw size={16} /> Refresh
          </button>
          {activeUploadId && (
            <>
              <a
                href={exportUrl(activeUploadId, "high-risk")}
                className="inline-flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
              >
                <Download size={16} /> High Risk CSV
              </a>
              <a
                href={exportUrl(activeUploadId, "all")}
                className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                <Download size={16} /> All Results CSV
              </a>
            </>
          )}
        </div>
      </div>

      {error && <div className="mb-5 rounded-md bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">Loading predictions...</div>
      ) : predictions.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">No predictions yet</h2>
          <p className="mt-2 text-slate-600">Upload a loan applicant CSV to populate the dashboard.</p>
          <Link
            to="/upload"
            className="mt-5 inline-flex rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Upload CSV
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <SummaryCards predictions={predictions} />
          <div className="grid gap-6 lg:grid-cols-2">
            <RiskDistributionChart predictions={predictions} />
            <RiskScoreHistogram predictions={predictions} />
          </div>
          <PredictionsTable predictions={predictions} onUpdated={onUpdated} />
        </div>
      )}
    </main>
  );
}
