import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Loader2,
  LogOut,
  Shield,
  Users,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getAdminStats } from "../services/adminApi";

function AdminDashboard() {
  const { user, logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminStats();

        setStats(response.data);
      } catch (error) {
        console.error("Failed to load admin stats:", error);
        setError("Failed to load statistics.");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const userStats = stats?.users || {};
  const jobStats = stats?.jobs || {};
  const applicationStats = stats?.applications || {};

  const statCards = [
    {
      label: "Total users",
      value: userStats.total_users || 0,
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Candidates",
      value: userStats.candidates || 0,
      color: "text-slate-600",
    },
    {
      label: "Employers",
      value: userStats.employers || 0,
      color: "text-purple-600",
    },
    {
      label: "Admins",
      value: userStats.admins || 0,
      color: "text-amber-600",
    },
    {
      label: "Total jobs",
      value: jobStats.total_jobs || 0,
      icon: BriefcaseBusiness,
      color: "text-emerald-600",
    },
    {
      label: "Total applications",
      value: applicationStats.total_applications || 0,
      color: "text-blue-600",
    },
    {
      label: "Pending applications",
      value: applicationStats.pending || 0,
      color: "text-slate-600",
    },
    {
      label: "Shortlisted",
      value: applicationStats.shortlisted || 0,
      color: "text-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-600">
                Admin Dashboard
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Welcome back, {user?.name?.split(" ")[0] || "Admin"}
              </h1>

              <p className="mt-2 text-slate-500">
                Platform overview and key metrics.
              </p>
            </div>

            <button
              onClick={logout}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card, index) => (
              <div key={index} className="rounded-2xl bg-slate-50 p-5">
                {card.icon && (
                  <card.icon size={20} className={`${card.color}`} />
                )}

                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {card.label}
                </p>

                {loading ? (
                  <Loader2
                    size={20}
                    className="mt-2 animate-spin text-slate-400"
                  />
                ) : (
                  <p
                    className={`mt-2 text-3xl font-bold text-slate-950 ${card.color || ""}`}
                  >
                    {card.value}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <Shield size={20} className="text-amber-600" />

              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Admin name
              </p>

              <p className="mt-1 font-semibold text-slate-900">{user?.name}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <Users size={20} className="text-blue-600" />

              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Email
              </p>

              <p className="mt-1 font-semibold text-slate-900">{user?.email}</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
            <p className="text-sm text-slate-500">
              Admin users have full access to jobs, applications, and platform
              statistics. Employer and candidate features remain unchanged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
