import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Loader2,
  LogOut,
  Mail,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getApplicationStats } from "../services/applicationApi";

function Dashboard() {
  const { user, logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setStatsLoading(true);

        const response = await getApplicationStats();

        setStats(response.data);
      } catch (error) {
        console.error("Failed to load application stats:", error);
      } finally {
        setStatsLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    { label: "Total applications", value: stats?.total || 0 },
    { label: "Pending", value: stats?.pending || 0, color: "text-blue-600" },
    {
      label: "Shortlisted",
      value: stats?.shortlisted || 0,
      color: "text-emerald-600",
    },
    {
      label: "Accepted",
      value: stats?.accepted || 0,
      color: "text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Candidate Dashboard
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Welcome back, {user?.name?.split(" ")[0] || "Candidate"}
              </h1>

              <p className="mt-2 text-slate-500">
                Manage your profile and applications from one place.
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
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {card.label}
                </p>

                {statsLoading ? (
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
              <User size={20} className="text-blue-600" />

              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Full name
              </p>

              <p className="mt-1 font-semibold text-slate-900">{user?.name}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <Mail size={20} className="text-blue-600" />

              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Email
              </p>

              <p className="mt-1 font-semibold text-slate-900">{user?.email}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">My Applications</h3>

              <p className="mt-1 text-sm text-slate-500">
                View and track all your job applications.
              </p>
            </div>

            <Link
              to="/dashboard/applications"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              View Applications
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
