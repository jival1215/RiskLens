import { BarChart3, ShieldCheck, UploadCloud } from "lucide-react";
import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
  }`;

export function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <ShieldCheck size={22} />
          </span>
          <div>
            <p className="text-lg font-semibold tracking-normal text-slate-950">RiskLens</p>
            <p className="text-xs text-slate-500">Credit risk monitoring</p>
          </div>
        </NavLink>
        <div className="flex items-center gap-2">
          <NavLink to="/" className={linkClass}>
            <BarChart3 size={16} /> Dashboard
          </NavLink>
          <NavLink to="/upload" className={linkClass}>
            <UploadCloud size={16} /> Upload
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
