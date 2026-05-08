import { AlertTriangle, CheckCircle2, Percent, Users } from "lucide-react";
import type { Prediction } from "../types/prediction";

const formatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

export function SummaryCards({ predictions }: { predictions: Prediction[] }) {
  const total = predictions.length;
  const highRisk = predictions.filter((prediction) => prediction.risk_level === "High Risk").length;
  const avgProbability = total
    ? predictions.reduce((sum, prediction) => sum + prediction.default_probability, 0) / total
    : 0;
  const approvalRate = total
    ? predictions.filter((prediction) => prediction.recommendation === "Approve").length / total
    : 0;

  const cards = [
    { label: "Total Applicants", value: total.toString(), icon: Users, tone: "text-slate-700" },
    { label: "High Risk", value: highRisk.toString(), icon: AlertTriangle, tone: "text-rose-600" },
    { label: "Avg Default Probability", value: `${formatter.format(avgProbability * 100)}%`, icon: Percent, tone: "text-amber-600" },
    { label: "Estimated Approval Rate", value: `${formatter.format(approvalRate * 100)}%`, icon: CheckCircle2, tone: "text-emerald-600" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <article key={card.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <card.icon className={card.tone} size={20} />
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-normal text-slate-950">{card.value}</p>
        </article>
      ))}
    </div>
  );
}
