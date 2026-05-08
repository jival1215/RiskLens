import type { ReviewStatus, RiskLevel } from "../types/prediction";

const riskClasses: Record<RiskLevel, string> = {
  "Low Risk": "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "Medium Risk": "bg-amber-50 text-amber-700 ring-amber-200",
  "High Risk": "bg-rose-50 text-rose-700 ring-rose-200",
};

const statusClasses: Record<ReviewStatus, string> = {
  Unreviewed: "bg-slate-100 text-slate-700 ring-slate-200",
  Reviewed: "bg-blue-50 text-blue-700 ring-blue-200",
  "Confirmed Risk": "bg-rose-50 text-rose-700 ring-rose-200",
  "False Positive": "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${riskClasses[level]}`}>{level}</span>;
}

export function ReviewBadge({ status }: { status: ReviewStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClasses[status]}`}>
      {status}
    </span>
  );
}
