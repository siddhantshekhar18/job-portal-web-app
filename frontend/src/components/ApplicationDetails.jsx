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
import { getApplicationById } from "../services/applicationApi";

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
    month: "long",
    year: "numeric",
  });
}

function ApplicationDetails() {
  const { id } = useParams();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchApplication() {
      try {
        setLoading(true);
        setError("");

        const response = await getApplicationById(id);

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
            to="/dashboard/applications"
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
          to="/dashboard/applications"
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
                {application.job_title}
              </h1>

              <p className="mt-1 text-slate-500">{application.company}</p>
            </div>

            <span
              className={`self-start rounded-full px-4 py-1.5 text-sm font-semibold ring-1 ${
                statusStyles[application.status] || statusStyles.pending
              }`}
            >
              {application.status}
            </span>
          </div>

          <div className="mt-6 grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-blue-600" />
              {application.location}
            </div>

            <div className="flex items-center gap-2">
              <BriefcaseBusiness size={16} className="text-blue-600" />
              ₹{Number(application.salary).toLocaleString("en-IN")} / year
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-blue-600" />
              Applied {formatDate(application.created_at)}
            </div>
          </div>

          <div className="my-8 h-px bg-slate-100" />

          <h2 className="text-lg font-bold text-slate-950">
            Candidate Information
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Full name
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {application.full_name}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-blue-600" />

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Email
                </p>
              </div>

              <p className="mt-1 font-semibold text-slate-900">
                {application.email}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-blue-600" />

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Phone
                </p>
              </div>

              <p className="mt-1 font-semibold text-slate-900">
                {application.phone}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-blue-600" />

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Resume
                </p>
              </div>

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
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetails;
