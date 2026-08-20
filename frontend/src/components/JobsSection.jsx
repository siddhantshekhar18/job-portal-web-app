import { ChevronDown, Filter, SlidersHorizontal } from "lucide-react";
import JobCard from "./JobCard";

function JobsSection({ jobs, loading, error }) {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Opportunities
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Latest job opportunities
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Explore roles from companies looking for talented people like you.
            </p>
          </div>

          <button className="hidden items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700 sm:flex">
            View all jobs
            <span>→</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="mt-10 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            <Filter size={17} />
            Filters
          </button>

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-slate-500">
              {loading ? "Loading..." : `${jobs.length} jobs found`}
            </span>

            <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              <SlidersHorizontal size={17} />
              Salary
              <ChevronDown size={15} />
            </button>
          </div>
        </div>

        {/* Jobs */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full flex min-h-64 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            </div>
          ) : error ? (
            <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="font-medium text-red-700">{error}</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-lg font-semibold text-slate-900">
                No jobs found
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            jobs.map((job) => <JobCard key={job.id} job={job} />)
          )}
        </div>

        {/* Mobile view all */}
        <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 sm:hidden">
          View all jobs
          <span>→</span>
        </button>
      </div>
    </section>
  );
}

export default JobsSection;
