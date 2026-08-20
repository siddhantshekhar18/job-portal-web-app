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

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    totalJobs: 0,
    totalPages: 0,
  });

  // Fetch jobs whenever the query changes
  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        setError("");

        const response = await getJobs(jobQuery);

        setJobs(response.data);

        setPagination(
          response.pagination || {
            page: jobQuery.page,
            limit: jobQuery.limit,
            totalJobs: 0,
            totalPages: 0,
          },
        );
      } catch (error) {
        console.error("Failed to fetch jobs:", error);

        setError("Failed to fetch jobs. Please try again later.");

        setJobs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [jobQuery]);

  // Search
  function handleSearch(params) {
    setJobQuery((current) => ({
      ...current,
      ...params,
      page: 1,
    }));
  }

  // Filters
  function handleFilter(params) {
    setJobQuery((current) => ({
      ...current,
      ...params,
      page: 1,
    }));
  }

  // Pagination
  function handlePageChange(page) {
    setJobQuery((current) => ({
      ...current,
      page,
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
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
}

export default App;
