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
import { getEmployerApplications, updateApplicationStatus } from "../services/employerApi";
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
    month: "short",
    year: "numeric",
  });
}

function EmployerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    async function fetchApplications() {
      try {
        setLoading(true);
        setError("");

        const response = await getEmployerApplications();

        setApplications(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(error);
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, []);

  async function handleStatusChange(applicationId, newStatus) {
    setUpdatingId(applicationId);

    try {
      await updateApplicationStatus(applicationId, newStatus);

      setApplications((current) =>
        current.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app,
        ),
      );
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message || "Failed to update status.";

      alert(message);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Applications
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Review Applications
            </h1>

            <p className="mt-2 text-slate-500">
              Review candidates who applied to your jobs.
            </p>
          </div>

          <Link
            to="/employer/dashboard"
            className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
            Dashboard
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
              When candidates apply to your jobs, they will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Candidate</th>
                    <th className="px-6 py-4">Job</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Applied</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {applications.map((application) => (
                    <tr key={application.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {application.full_name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500">
                            {application.email}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">
                          {application.job_title}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {application.company}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-slate-600">
                          <MapPin size={14} className="text-blue-600" />
                          {application.location}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-slate-600">
                          <Calendar size={14} className="text-blue-600" />
                          {formatDate(application.created_at)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={application.status} />
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/employer/applications/${application.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                          >
                            View
                            <ArrowUpRight size={14} />
                          </Link>

                          <select
                            value={application.status}
                            onChange={(e) =>
                              handleStatusChange(application.id, e.target.value)
                            }
                            disabled={updatingId === application.id}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-70"
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployerApplications;
