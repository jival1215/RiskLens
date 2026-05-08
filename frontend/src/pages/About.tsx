const schema = [
  "applicant_id",
  "Time",
  ...Array.from({ length: 28 }, (_, index) => `V${index + 1}`),
  "Amount",
];

export function About() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">About RiskLens</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">Full-stack ML credit risk monitoring</h1>
        <p className="mt-4 text-slate-600">
          RiskLens turns a trained scikit-learn default prediction model into an operational dashboard for applicant
          risk scoring, analyst review, and CSV reporting. The backend returns model-based default probabilities, assigns
          risk bands, and persists case status changes so analysts can work through high-risk applications.
        </p>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Expected CSV Schema</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {schema.map((column) => (
            <code key={column} className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">
              {column}
            </code>
          ))}
        </div>
      </section>
    </main>
  );
}
