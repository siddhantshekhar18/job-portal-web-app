import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  Calendar,
  Loader2,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../services/applicationApi";

const statusStyles = {
  pending: "bg-blue-50 text-blue-700 ring-blue-600/20",
  reviewing: "bg-purple-50 text-purple-700 ring-purple-600/20",
  shortlisted: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  accepted: "bg-green-50 text-green-700 ring-green-600/20",
  rejected: "bg-red-50 text-red-700 ring-red-600/20",
};

function formatDate(dateString) {
  if (!dateString) return "";

  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchApplications() {
      try {
        setLoading(true);
        setError("");

        const response = await getMyApplications();

        setApplications(response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load your applications.");
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
              My Applications
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Applications
            </h1>

            <p className="mt-2 text-slate-500">
              Track the status of jobs you have applied for.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
            Back to dashboard
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-slate-400" />
          </div>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-700">{error}</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <BriefcaseBusiness size={24} className="text-slate-500" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-950">
              No applications yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You haven't applied to any jobs yet. Browse open roles and submit
              your first application.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Browse jobs
              <ArrowUpRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-5">
            {applications.map((application) => (
              <Link
                key={application.id}
                to={`/dashboard/applications/${application.id}`}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md sm:p-8"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-bold text-slate-950 transition group-hover:text-blue-600 sm:text-xl">
                        {application.job_title}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                          statusStyles[application.status] ||
                          statusStyles.pending
                        }`}
                      >
                        {application.status}
                      </span>
                    </div>

                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {application.company}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={15} className="text-blue-600" />
                        {application.location}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={15} className="text-blue-600" />
                        Applied {formatDate(application.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-xs font-medium text-slate-400">Salary</p>

                    <p className="mt-1 text-base font-bold text-slate-900">
                      ₹{Number(application.salary).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Applications;
