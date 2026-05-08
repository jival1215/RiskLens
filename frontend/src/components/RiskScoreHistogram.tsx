import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Prediction } from "../types/prediction";

export function RiskScoreHistogram({ predictions }: { predictions: Prediction[] }) {
  const bins = Array.from({ length: 10 }, (_, index) => ({
    range: `${index * 10}-${index * 10 + 10}%`,
    count: 0,
  }));

  predictions.forEach((prediction) => {
    const index = Math.min(9, Math.floor(prediction.default_probability * 10));
    bins[index].count += 1;
  });

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Risk Score Histogram</h2>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bins}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="range" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#0f766e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
