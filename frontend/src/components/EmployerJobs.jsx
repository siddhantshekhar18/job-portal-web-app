import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  deleteEmployerJob,
  getEmployerJobs,
} from "../services/employerApi";

function formatSalary(salary) {
  return `₹${Number(salary).toLocaleString("en-IN")}`;
}

function EmployerJobs() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const isPersonalJobsPage = pathname.startsWith("/my-jobs");
  const jobsPath = isPersonalJobsPage ? "/my-jobs" : "/employer/jobs";
  const postJobPath = isPersonalJobsPage ? "/post-job" : "/employer/jobs/new";
  const canViewApplications = user?.role === "employer" || user?.role === "admin";

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        setError("");

        const response = await getEmployerJobs();

        setJobs(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(error);
        setError("Failed to load your jobs.");
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this job?")) {
      return;
    }

    setDeletingId(id);

    try {
      await deleteEmployerJob(id);

      setJobs((current) => current.filter((job) => job.id !== id));
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message || "Failed to delete the job.";

      alert(message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Job Management
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              My Jobs
            </h1>

            <p className="mt-2 text-slate-500">
              Manage your job postings and track applications.
            </p>
          </div>

          <div className="flex gap-3">
            <Link to="/" className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"><ArrowLeft size={17} />Browse jobs</Link>

            <Link
              to={postJobPath}
              className="inline-flex items-center gap-2 self-start rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              <Plus size={17} />
              Post a job
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="mt-10 flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-slate-400" />
          </div>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-700">{error}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <BriefcaseBusiness size={24} className="text-slate-500" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-950">
              No jobs posted yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Start hiring by creating your first job posting.
            </p>

            <Link
              to={postJobPath}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Post a job
              <ArrowUpRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Job</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Salary</th>
                    <th className="px-6 py-4">Applications</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {job.title}
                          </p>

                          <p className="mt-0.5 text-slate-500">{job.company}</p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-slate-600">
                          <MapPin size={14} className="text-blue-600" />
                          {job.location}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {job.employment_type || "Full-time"}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-900">
                        {formatSalary(job.salary)}
                      </td>

                      <td className="px-6 py-4">
                        {canViewApplications ? <button onClick={() => navigate(`/employer/applications?job=${job.id}`)} className="font-medium text-blue-600 transition hover:text-blue-500">{job.application_count || 0} applications</button> : <span>{job.application_count || 0} applications</span>}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`${jobsPath}/${job.id}/edit`}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Pencil size={15} />
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(job.id)}
                            disabled={deletingId === job.id}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-red-600 transition hover:bg-red-50 disabled:opacity-70"
                          >
                            {deletingId === job.id ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                            Delete
                          </button>
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

export default EmployerJobs;
