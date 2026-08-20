import { Filter, X } from "lucide-react";
import { useState } from "react";
import JobCard from "./JobCard";
import FilterPanel from "./FilterPanel";
import Pagination from "./Pagination";

function JobsSection({
  jobs,
  loading,
  error,
  query,
  onFilter,
  pagination,
  onPageChange,
}) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters =
    query?.location || query?.minSalary || query?.maxSalary || query?.sort;

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

          <button
            type="button"
            className="hidden items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700 sm:flex"
          >
            View all jobs
            <span>→</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="mt-10">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            {/* Filter button */}
            <button
              type="button"
              onClick={() => setShowFilters((current) => !current)}
              className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                showFilters
                  ? "border-blue-200 bg-blue-50 text-blue-600"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {showFilters ? <X size={17} /> : <Filter size={17} />}

              {showFilters ? "Hide Filters" : "Filters"}
            </button>

            {/* Results information */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-500">
                {loading
                  ? "Loading jobs..."
                  : `${jobs.length} ${
                      jobs.length === 1 ? "job" : "jobs"
                    } found`}
              </span>

              {hasActiveFilters && !loading && (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                  Filters active
                </span>
              )}
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4">
              <FilterPanel
                query={query}
                onApply={(params) => {
                  onFilter(params);
                  setShowFilters(false);
                }}
                onClose={() => setShowFilters(false)}
              />
            </div>
          )}
        </div>

        {/* Jobs */}
        <div className="mt-8">
          {loading ? (
            /* Loading state */
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="p-6">
                    <div className="h-12 w-12 rounded-xl bg-slate-200" />

                    <div className="mt-6 h-4 w-20 rounded bg-slate-200" />

                    <div className="mt-3 h-6 w-3/4 rounded bg-slate-200" />

                    <div className="mt-2 h-4 w-1/2 rounded bg-slate-200" />

                    <div className="mt-8 h-4 w-2/3 rounded bg-slate-200" />

                    <div className="mt-6 h-px w-full bg-slate-100" />

                    <div className="mt-5 h-8 w-1/2 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            /* Error state */
            <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
              <h3 className="text-lg font-bold text-red-800">
                Unable to load jobs
              </h3>

              <p className="mt-2 text-sm text-red-600">{error}</p>
            </div>
          ) : jobs.length === 0 ? (
            /* Empty state */
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <Filter size={22} className="text-slate-500" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-950">
                No jobs found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                We couldn't find any jobs matching your current search and
                filters. Try adjusting your criteria.
              </p>
            </div>
          ) : (
            /* Job cards */
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
        />

        {/* Mobile view all */}
        <button
          type="button"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:hidden"
        >
          View all jobs
          <span>→</span>
        </button>
      </div>
    </section>
  );
}

export default JobsSection;
