import { ArrowDownAZ, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { updatePredictionStatus } from "../api/client";
import type { Prediction, ReviewStatus, RiskLevel } from "../types/prediction";
import { RiskBadge } from "./StatusBadge";

const reviewStatuses: ReviewStatus[] = ["Unreviewed", "Reviewed", "Confirmed Risk", "False Positive"];
const riskFilters: Array<RiskLevel | "All"> = ["All", "Low Risk", "Medium Risk", "High Risk"];

export function PredictionsTable({
  predictions,
  onUpdated,
}: {
  predictions: Prediction[];
  onUpdated: (prediction: Prediction) => void;
}) {
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "All">("All");
  const [search, setSearch] = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  const filtered = useMemo(() => {
    return predictions
      .filter((prediction) => riskFilter === "All" || prediction.risk_level === riskFilter)
      .filter((prediction) => prediction.applicant_id.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) =>
        sortDesc ? b.default_probability - a.default_probability : a.default_probability - b.default_probability,
      );
  }, [predictions, riskFilter, search, sortDesc]);
  const visibleRows = filtered.slice(0, 500);

  const updateStatus = async (predictionId: number, status: ReviewStatus) => {
    const updated = await updatePredictionStatus(predictionId, status);
    onUpdated(updated);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-base font-semibold text-slate-950">Transaction Predictions</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search applicant"
              className="h-10 rounded-md border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <select
            value={riskFilter}
            onChange={(event) => setRiskFilter(event.target.value as RiskLevel | "All")}
            className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            {riskFilters.map((risk) => (
              <option key={risk}>{risk}</option>
            ))}
          </select>
          <button
            onClick={() => setSortDesc((current) => !current)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <ArrowDownAZ size={16} /> Probability
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Transaction</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Risk Prob.</th>
              <th className="px-5 py-3">Risk</th>
              <th className="px-5 py-3">Recommendation</th>
              <th className="px-5 py-3">Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleRows.map((prediction) => (
              <tr key={prediction.prediction_id} className="hover:bg-slate-50">
                <td className="px-5 py-4 font-medium text-slate-950">{prediction.applicant_id}</td>
                <td className="px-5 py-4">${prediction.loan_amnt.toLocaleString()}</td>
                <td className="px-5 py-4 font-semibold">{(prediction.default_probability * 100).toFixed(1)}%</td>
                <td className="px-5 py-4">
                  <RiskBadge level={prediction.risk_level} />
                </td>
                <td className="px-5 py-4 text-slate-700">{prediction.recommendation}</td>
                <td className="px-5 py-4">
                  <select
                    value={prediction.review_status}
                    onChange={(event) => updateStatus(prediction.prediction_id, event.target.value as ReviewStatus)}
                    className="h-9 rounded-md border border-slate-300 px-2 text-sm outline-none focus:border-emerald-600"
                  >
                    {reviewStatuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-6 text-sm text-slate-500">No applicants match the current filters.</p>}
        {filtered.length > visibleRows.length && (
          <p className="border-t border-slate-100 p-4 text-sm text-slate-500">
            Showing first {visibleRows.length.toLocaleString()} of {filtered.length.toLocaleString()} matching records.
            Use search or risk filters to narrow the table.
          </p>
        )}
      </div>
    </section>
  );
}
