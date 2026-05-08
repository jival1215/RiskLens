import { ChangeEvent, DragEvent, useState } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { uploadApplicants } from "../api/client";
import type { UploadResult } from "../types/prediction";

interface UploadCardProps {
  onUploaded: (result: UploadResult) => void;
}

function formatApiError(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { detail?: unknown } } }).response;
    const detail = response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (typeof detail === "object" && detail !== null) return JSON.stringify(detail, null, 2);
  }
  return "Upload failed. Check the API server and CSV format.";
}

export function UploadCard({ onUploaded }: UploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const chooseFile = (selected?: File) => {
    setError("");
    setFile(selected ?? null);
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    chooseFile(event.dataTransfer.files[0]);
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    chooseFile(event.target.files?.[0]);
  };

  const submit = async () => {
    if (!file) {
      setError("Select a CSV file before uploading.");
      return;
    }
    setLoading(true);
    setProgress(0);
    setError("");
    try {
      const result = await uploadApplicants(file, setProgress);
      onUploaded(result);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <label
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
        className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 text-center transition hover:border-emerald-500 hover:bg-emerald-50"
      >
        <FileUp className="mb-4 text-emerald-600" size={34} />
        <span className="text-base font-semibold text-slate-950">{file ? file.name : "Drop applicant CSV here"}</span>
        <span className="mt-2 text-sm text-slate-500">or choose a file from your machine</span>
        <input type="file" accept=".csv" onChange={onFileChange} className="sr-only" />
      </label>

      {loading && (
        <div className="mt-5 h-2 rounded-full bg-slate-100">
          <div className="h-2 rounded-full bg-emerald-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      {error && <pre className="mt-5 overflow-auto rounded-md bg-rose-50 p-4 text-sm text-rose-700">{error}</pre>}

      <button
        onClick={submit}
        disabled={loading}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading && <Loader2 className="animate-spin" size={16} />}
        Run Risk Scoring
      </button>
    </section>
  );
}
