import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  IndianRupee,
  Layers,
  List,
  MapPin,
  Wrench,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getJobById } from "../services/jobApi";
import { useAuth } from "../hooks/useAuth";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      try {
        setLoading(true);
        setError("");

        const response = await getJobById(id);

        setJob(response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load this job.");
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [id]);

  function handleApply() {
    if (isAuthenticated) {
      navigate(`/jobs/${id}/apply`);
    } else {
      navigate("/login", {
        state: { from: { pathname: `/jobs/${id}/apply` } },
      });
    }
  }

  function toggleSave() {
    setSaved((current) => !current);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
          <div className="animate-pulse">
            <div className="h-5 w-32 rounded bg-slate-200" />
            <div className="mt-10 h-10 w-2/3 rounded bg-slate-200" />
            <div className="mt-4 h-5 w-1/3 rounded bg-slate-200" />

            <div className="mt-10 h-64 rounded-3xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-xl font-bold text-red-800">Unable to load job</h2>

          <p className="mt-2 text-sm text-red-600">{error}</p>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            <ArrowLeft size={17} />
            Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Job not found</h2>

          <p className="mt-2 text-sm text-slate-500">
            The job you are looking for does not exist or has been removed.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            <ArrowLeft size={17} />
            Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  const salaryLabel = `₹${Number(job.salary).toLocaleString("en-IN")} / year`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-20">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to jobs
          </Link>

          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              {/* Company logo */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-2xl font-bold text-white shadow-lg shadow-blue-900/30 sm:h-18 sm:w-18 sm:text-3xl">
                {job.company?.charAt(0)?.toUpperCase()}
              </div>

              <div>
                {/* Employment badge */}
                <span className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/20">
                  {job.employment_type || "Full-time"}
                </span>

                {/* Title */}
                <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {job.title}
                </h1>

                {/* Company */}
                <p className="mt-2 text-lg font-medium text-slate-300">
                  {job.company}
                </p>
              </div>
            </div>

            {/* Salary (visible on desktop hero, duplicated in sidebar on mobile) */}
            <div className="hidden shrink-0 rounded-2xl bg-slate-900/60 p-5 ring-1 ring-slate-800 lg:block lg:w-64">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Salary
              </p>

              <p className="mt-1 text-2xl font-bold text-white">{salaryLabel}</p>
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-800 pt-6 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2">
              <MapPin size={17} className="text-blue-400" />
              {job.location}
            </span>

            <span className="inline-flex items-center gap-2">
              <IndianRupee size={17} className="text-blue-400" />
              {Number(job.salary).toLocaleString("en-IN")} / year
            </span>

            {job.experience_level && (
              <span className="inline-flex items-center gap-2">
                <GraduationCap size={17} className="text-blue-400" />
                {job.experience_level}
              </span>
            )}

            {job.employment_type && (
              <span className="inline-flex items-center gap-2">
                <BriefcaseBusiness size={17} className="text-blue-400" />
                {job.employment_type}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main content */}
          <div className="space-y-8">
            {/* About the role */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                About the role
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                What you will be doing
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                {job.description ||
                  `This is a ${job.title} opportunity at ${job.company} based in ${job.location}.`}
              </p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities?.length > 0 && (
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  Responsibilities
                </p>

                <h2 className="mt-2 flex items-center gap-2 text-2xl font-bold text-slate-950">
                  <List size={24} className="text-blue-600" />
                  Key responsibilities
                </h2>

                <ul className="mt-6 space-y-4">
                  {job.responsibilities.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 leading-7 text-slate-600"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  Requirements
                </p>

                <h2 className="mt-2 flex items-center gap-2 text-2xl font-bold text-slate-950">
                  <CheckCircle2 size={24} className="text-blue-600" />
                  What we are looking for
                </h2>

                <ul className="mt-6 space-y-4">
                  {job.requirements.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 leading-7 text-slate-600"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Job information */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Job information
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                Role details
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <BriefcaseBusiness size={20} className="text-blue-600" />

                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Position
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {job.title}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <MapPin size={20} className="text-blue-600" />

                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Location
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {job.location}
                  </p>
                </div>

                {job.employment_type && (
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <Layers size={20} className="text-blue-600" />

                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Employment type
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {job.employment_type}
                    </p>
                  </div>
                )}

                {job.experience_level && (
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <GraduationCap size={20} className="text-blue-600" />

                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Experience level
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {job.experience_level}
                    </p>
                  </div>
                )}

                <div className="rounded-2xl bg-slate-50 p-5 sm:col-span-2">
                  <IndianRupee size={20} className="text-blue-600" />

                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Salary
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {salaryLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="h-fit space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <div>
              <p className="text-sm font-medium text-slate-500">Salary</p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                ₹{Number(job.salary).toLocaleString("en-IN")}
              </p>

              <p className="mt-1 text-sm text-slate-400">per year</p>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-6 text-sm text-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <BriefcaseBusiness size={16} className="text-blue-600" />
                </div>

                <div>
                  <p className="text-xs text-slate-400">Employment type</p>

                  <p className="font-semibold text-slate-900">
                    {job.employment_type || "Full-time"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <GraduationCap size={16} className="text-blue-600" />
                </div>

                <div>
                  <p className="text-xs text-slate-400">Experience level</p>

                  <p className="font-semibold text-slate-900">
                    {job.experience_level || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <MapPin size={16} className="text-blue-600" />
                </div>

                <div>
                  <p className="text-xs text-slate-400">Location</p>

                  <p className="font-semibold text-slate-900">{job.location}</p>
                </div>
              </div>
            </div>

            {job.skills?.length > 0 && (
              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center gap-2">
                  <Wrench size={18} className="text-blue-600" />

                  <p className="text-sm font-semibold text-slate-900">Skills</p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={handleApply}
                className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Apply Now
              </button>

              <button
                type="button"
                onClick={toggleSave}
                className={`flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-3.5 text-sm font-semibold transition ${
                  saved
                    ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {saved ? (
                  <>
                    <BookmarkCheck size={18} />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark size={18} />
                    Save Job
                  </>
                )}
              </button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default JobDetails;
