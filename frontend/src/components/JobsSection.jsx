import { ChevronDown, Filter, SlidersHorizontal } from "lucide-react";
import JobCard from "./JobCard";

const sampleJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "Remote",
    salary: 60000,
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "CodeLabs",
    location: "Bangalore",
    salary: 70000,
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "InnovateTech",
    location: "Hyderabad",
    salary: 80000,
  },
];

function JobsSection() {
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
            <span className="text-sm text-slate-500">3 jobs found</span>

            <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              <SlidersHorizontal size={17} />
              Salary
              <ChevronDown size={15} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {sampleJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
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
