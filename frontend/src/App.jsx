import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import JobsSection from "./components/JobsSection";
import { getJobs } from "./services/jobApi";

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useState({});

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        setError("");

        const response = await getJobs(searchParams);

        setJobs(response.data);
      } catch (error) {
        console.error(error);

        setError("Failed to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [searchParams]);

  function handleSearch(params) {
    setSearchParams(params);
  }

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Navbar />

      <main>
        <Hero onSearch={handleSearch} />

        <JobsSection jobs={jobs} loading={loading} error={error} />
      </main>
    </div>
  );
}

export default App;
