import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  MapPin,
  IndianRupee,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getJobById } from "../services/jobApi";

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-5xl px-6 py-14 lg:px-8 lg:py-20">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to jobs
          </Link>

          <div className="mt-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-slate-950 shadow-lg">
              {job.company?.charAt(0)?.toUpperCase()}
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-blue-400">
              {job.company}
            </p>

            <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {job.title}
            </h1>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2">
                <MapPin size={17} />
                {job.location}
              </span>

              <span className="inline-flex items-center gap-2">
                <IndianRupee size={17} />
                {Number(job.salary).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main content */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold text-slate-950">
              About this role
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              This is a {job.title} opportunity at {job.company} based in{" "}
              {job.location}.
            </p>

            <div className="my-10 h-px bg-slate-100" />

            <h2 className="text-2xl font-bold text-slate-950">
              Job information
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
            </div>
          </div>

          {/* Sidebar */}
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <p className="text-sm font-medium text-slate-500">Salary</p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              ₹{Number(job.salary).toLocaleString("en-IN")}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Salary information provided by employer
            </p>

            <button
              type="button"
              className="mt-7 flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Apply Now
            </button>

            <button
              type="button"
              className="mt-3 flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Save Job
            </button>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default JobDetails;
