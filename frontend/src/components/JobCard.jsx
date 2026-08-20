import { ArrowUpRight, BriefcaseBusiness, Clock3, MapPin } from "lucide-react";

function JobCard({ job }) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/60">
      <div className="flex items-start justify-between gap-4">
        {/* Company icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-blue-50 group-hover:text-blue-600">
          <BriefcaseBusiness size={22} />
        </div>

        {/* Save button */}
        <button
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Save job"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      {/* Job information */}
      <div className="mt-5">
        <div className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
          Full-time
        </div>

        <h3 className="text-lg font-bold tracking-tight text-slate-950 transition group-hover:text-blue-600">
          {job.title}
        </h3>

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

        <button className="flex items-center gap-1.5 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600">
          View job
          <ArrowUpRight size={16} />
        </button>
      </div>
    </article>
  );
}

export default JobCard;
