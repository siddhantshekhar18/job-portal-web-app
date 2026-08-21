import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Hero from "./components/Hero";
import JobsSection from "./components/JobsSection";
import JobDetails from "./components/JobDetails";
import ApplyJob from "./components/ApplyJob";

import { getJobs } from "./services/jobApi";

function JobsPage() {
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

  function handlePageChange(page) {
    setJobQuery((current) => ({
      ...current,
      page,
    }));
  }

  return (
    <>
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
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<JobsPage />} />

          <Route path="/jobs/:id" element={<JobDetails />} />

          <Route path="/jobs/:id/apply" element={<ApplyJob />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
