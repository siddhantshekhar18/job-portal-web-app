import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Hero from "./components/Hero";
import JobsSection from "./components/JobsSection";
import JobDetails from "./components/JobDetails";
import ApplyJob from "./components/ApplyJob";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Applications from "./components/Applications";
import ApplicationDetails from "./components/ApplicationDetails";
import EmployerDashboard from "./components/EmployerDashboard";
import EmployerJobs from "./components/EmployerJobs";
import EmployerJobForm from "./components/EmployerJobForm";
import EmployerApplications from "./components/EmployerApplications";
import EmployerApplicationDetails from "./components/EmployerApplicationDetails";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import FooterPage from "./components/FooterPage";
import SavedJobs from "./components/SavedJobs";

import { getJobs } from "./services/jobApi";
import { getSavedJobs } from "./services/savedJobApi";
import { useAuth } from "./hooks/useAuth";

function JobsPage() {
  const { isAuthenticated } = useAuth();
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
  const [savedJobIds, setSavedJobIds] = useState(new Set());

  useEffect(() => {
    async function fetchSavedJobs() {
      if (!isAuthenticated) {
        setSavedJobIds(new Set());
        return;
      }

      try {
        const response = await getSavedJobs();
        setSavedJobIds(new Set(response.data.map((job) => job.id)));
      } catch (error) {
        console.error("Failed to load saved jobs:", error);
      }
    }

    fetchSavedJobs();
  }, [isAuthenticated]);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        setError("");

        const response = await getJobs(jobQuery);

        setJobs(Array.isArray(response.data) ? response.data : []);

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

  function handleSavedChange(jobId, isSaved) {
    setSavedJobIds((current) => {
      const next = new Set(current);
      if (isSaved) next.add(jobId);
      else next.delete(jobId);
      return next;
    });
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
        savedJobIds={savedJobIds}
        onSavedChange={handleSavedChange}
      />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<JobsPage />} />

            <Route path="/jobs/:id" element={<JobDetails />} />

            <Route
              path="/jobs/:id/apply"
              element={
                <ProtectedRoute>
                  <ApplyJob />
                </ProtectedRoute>
              }
            />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/footer/:page" element={<FooterPage />} />

            <Route
              path="/post-job"
              element={
                <ProtectedRoute>
                  <EmployerJobForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-jobs"
              element={
                <ProtectedRoute>
                  <EmployerJobs />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-jobs/:id/edit"
              element={
                <ProtectedRoute>
                  <EmployerJobForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/saved-jobs"
              element={
                <ProtectedRoute>
                  <SavedJobs />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/applications"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <Applications />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/applications/:id"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <ApplicationDetails />
                </ProtectedRoute>
              }
            />

            {/* Employer routes */}
            <Route
              path="/employer/dashboard"
              element={
                <ProtectedRoute allowedRoles={["employer", "admin"]}>
                  <EmployerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/employer/jobs"
              element={
                <ProtectedRoute allowedRoles={["employer", "admin"]}>
                  <EmployerJobs />
                </ProtectedRoute>
              }
            />

            <Route
              path="/employer/jobs/new"
              element={
                <ProtectedRoute allowedRoles={["employer", "admin"]}>
                  <EmployerJobForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/employer/jobs/:id/edit"
              element={
                <ProtectedRoute allowedRoles={["employer", "admin"]}>
                  <EmployerJobForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/employer/applications"
              element={
                <ProtectedRoute allowedRoles={["employer", "admin"]}>
                  <EmployerApplications />
                </ProtectedRoute>
              }
            />

            <Route
              path="/employer/applications/:id"
              element={
                <ProtectedRoute allowedRoles={["employer", "admin"]}>
                  <EmployerApplicationDetails />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
