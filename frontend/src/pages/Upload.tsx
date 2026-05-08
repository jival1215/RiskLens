import { Link, useNavigate } from "react-router-dom";
import { UploadCard } from "../components/UploadCard";
import type { UploadResult } from "../types/prediction";

export function Upload() {
  const navigate = useNavigate();

  const handleUploaded = (result: UploadResult) => {
    localStorage.setItem("risklens:lastUploadId", String(result.id));
    navigate(`/?uploadId=${result.id}`);
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">CSV intake</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">Score loan applicants</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Upload transaction records using the expected schema. RiskLens validates the file, runs model scoring, and stores
          results for analyst review.
        </p>
      </div>
      <UploadCard onUploaded={handleUploaded} />
      <p className="mt-5 text-sm text-slate-500">
        Sample data is available at <span className="font-mono">backend/sample_creditcard_transactions.csv</span>.{" "}
        <Link to="/about" className="font-semibold text-emerald-700 hover:text-emerald-800">
          View schema details
        </Link>
      </p>
    </main>
  );
}
