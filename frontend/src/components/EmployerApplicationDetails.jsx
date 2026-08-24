import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Calendar,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  getEmployerApplicationById,
  updateApplicationStatus,
} from "../services/employerApi";
import StatusBadge from "./StatusBadge";

const STATUS_OPTIONS = [
  "pending",
  "reviewing",
  "shortlisted",
  "rejected",
  "accepted",
];

function formatDate(dateString) {
  if (!dateString) return "";

  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function EmployerApplicationDetails() {
  const { id } = useParams();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchApplication() {
      try {
        setLoading(true);
        setError("");

        const response = await getEmployerApplicationById(id);

        setApplication(response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load this application.");
      } finally {
        setLoading(false);
      }
    }

    fetchApplication();
  }, [id]);

  async function handleStatusChange(newStatus) {
    setUpdating(true);

    try {
      await updateApplicationStatus(id, newStatus);

      setApplication((current) =>
        current ? { ...current, status: newStatus } : current,
      );
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message || "Failed to update status.";

      alert(message);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 size={28} className="animate-spin text-slate-400" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Application not found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error || "The application you are looking for does not exist."}
          </p>

          <Link
            to="/employer/applications"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            <ArrowLeft size={17} />
            Back to applications
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <Link
          to="/employer/applications"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to applications
        </Link>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Application Details
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                {application.full_name}
              </h1>

              <p className="mt-1 text-slate-500">
                Applied for {application.job_title}
              </p>
            </div>

            <StatusBadge status={application.status} />
          </div>

          <div className="mt-6 grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-blue-600" />
              {application.email}
            </div>

            <div className="flex items-center gap-2">
              <Phone size={16} className="text-blue-600" />
              {application.phone}
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-blue-600" />
              Applied {formatDate(application.created_at)}
            </div>
          </div>

          <div className="my-8 h-px bg-slate-100" />

          <h2 className="text-lg font-bold text-slate-950">Job Information</h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <BriefcaseBusiness size={20} className="text-blue-600" />

              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Position
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {application.job_title}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <MapPin size={20} className="text-blue-600" />

              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Location
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {application.location}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <FileText size={20} className="text-blue-600" />

              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Resume
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {application.resume_path}
              </p>
            </div>
          </div>

          {application.cover_letter && (
            <>
              <div className="my-8 h-px bg-slate-100" />

              <h2 className="text-lg font-bold text-slate-950">Cover Letter</h2>

              <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">
                {application.cover_letter}
              </p>
            </>
          )}

          <div className="my-8 h-px bg-slate-100" />

          <h2 className="text-lg font-bold text-slate-950">Update Status</h2>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <select
              value={application.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-70"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            {updating && (
              <Loader2 size={20} className="animate-spin text-slate-400" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployerApplicationDetails;
