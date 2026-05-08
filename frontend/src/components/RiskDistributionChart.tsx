import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Prediction, RiskLevel } from "../types/prediction";

const COLORS: Record<RiskLevel, string> = {
  "Low Risk": "#059669",
  "Medium Risk": "#d97706",
  "High Risk": "#e11d48",
};

export function RiskDistributionChart({ predictions }: { predictions: Prediction[] }) {
  const data = (["Low Risk", "Medium Risk", "High Risk"] as RiskLevel[]).map((level) => ({
    name: level,
    value: predictions.filter((prediction) => prediction.risk_level === level).length,
  }));

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Risk Distribution</h2>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={3}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
