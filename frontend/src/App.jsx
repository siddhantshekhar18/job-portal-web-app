import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import JobsSection from "./components/JobsSection";
import { getJobs } from "./services/jobApi";

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [jobQuery, setJobQuery] = useState({
    search: undefined,
    location: undefined,
    minSalary: undefined,
    maxSalary: undefined,
    sort: undefined,
    page: 1,
    limit: 6,
  });

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        setError("");

        const response = await getJobs(jobQuery);

        setJobs(response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [jobQuery]);

  function handleSearch(params) {
    setJobQuery((current) => ({
      ...current,
      ...params,
      page: 1,
    }));
  }

  function handleFilter(params) {
    setJobQuery((current) => ({
      ...current,
      ...params,
      page: 1,
    }));
  }

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Navbar />

      <main>
        <Hero onSearch={handleSearch} />

        <JobsSection
          jobs={jobs}
          loading={loading}
          error={error}
          query={jobQuery}
          onFilter={handleFilter}
        />
      </main>
    </div>
  );
}

export default App;
