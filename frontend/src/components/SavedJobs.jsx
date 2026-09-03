import { Bookmark, BriefcaseBusiness } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import JobCard from "./JobCard";
import { getSavedJobs } from "../services/savedJobApi";

function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSavedJobs() {
      try {
        const response = await getSavedJobs();
        setJobs(Array.isArray(response.data) ? response.data : []);
      } catch (requestError) {
        console.error("Failed to load saved jobs:", requestError);
        setError("We could not load your saved jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadSavedJobs();
  }, []);

  function handleSavedChange(jobId, isSaved) {
    if (!isSaved) setJobs((current) => current.filter((job) => job.id !== jobId));
  }

  return <section className="min-h-screen bg-slate-50 py-12"><div className="mx-auto max-w-7xl px-6 lg:px-8"><div className="flex items-start gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Bookmark size={23} /></div><div><p className="text-sm font-bold uppercase tracking-widest text-blue-600">Your shortlist</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Saved jobs</h1><p className="mt-2 text-slate-500">Review opportunities you want to return to.</p></div></div><div className="mt-10">{loading ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" />)}</div> : error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">{error}</div> : jobs.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{jobs.map((job) => <JobCard key={job.id} job={job} saved onSavedChange={handleSavedChange} />)}</div> : <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500"><BriefcaseBusiness size={24} /></div><h2 className="mt-5 text-xl font-bold text-slate-950">No saved jobs yet</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Use the bookmark on any job card to build a shortlist of opportunities.</p><Link to="/" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">Browse jobs</Link></div>}</div></div></section>;
}

export default SavedJobs;
