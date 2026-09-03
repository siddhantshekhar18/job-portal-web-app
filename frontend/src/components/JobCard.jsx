import { ArrowUpRight, Bookmark, BookmarkCheck, BriefcaseBusiness, Clock3, Loader2, MapPin } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { removeSavedJob, saveJob } from "../services/savedJobApi";

function JobCard({ job, saved = false, onSavedChange }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [saving, setSaving] = useState(false);

  async function handleSave(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    if (saving) return;
    setSaving(true);
    try {
      if (saved) await removeSavedJob(job.id);
      else await saveJob(job.id);
      onSavedChange?.(job.id, !saved);
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="group relative rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/60">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        {/* Company icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition duration-300 group-hover:bg-blue-50 group-hover:text-blue-600">
          <BriefcaseBusiness size={22} />
        </div>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={`rounded-lg p-2 transition disabled:cursor-not-allowed disabled:opacity-60 ${saved ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"}`}
          aria-label={`${saved ? "Remove" : "Save"} ${job.title} at ${job.company}`}
        >
          {saving ? <Loader2 size={20} className="animate-spin" /> : saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
        </button>
      </div>

      {/* Job information */}
      <div className="mt-5">
        <div className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
          {job.employment_type || "Full-time"}
        </div>

        <Link to={`/jobs/${job.id}`} className="block">
          <h3 className="text-lg font-bold tracking-tight text-slate-950 transition group-hover:text-blue-600">
            {job.title}
          </h3>
        </Link>

        <p className="mt-1 text-sm font-medium text-slate-500">{job.company}</p>
      </div>

      {/* Metadata */}
      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
        <span className="flex items-center gap-1.5">
          <MapPin size={15} />
          {job.location}
        </span>

        <span className="flex items-center gap-1.5">
          <Clock3 size={15} />
          Recently posted
        </span>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-5">
        <div>
          <p className="text-xs font-medium text-slate-400">Salary</p>

          <p className="mt-1 text-base font-bold text-slate-950">
            ₹{Number(job.salary).toLocaleString("en-IN")}
            <span className="ml-1 text-xs font-medium text-slate-400">
              / year
            </span>
          </p>
        </div>

        {/* View job */}
        <Link
          to={`/jobs/${job.id}`}
          className="flex items-center gap-1.5 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          View job
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}

export default JobCard;
