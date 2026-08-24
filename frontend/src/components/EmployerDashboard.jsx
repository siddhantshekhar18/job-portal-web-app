import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Loader2,
  LogOut,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getEmployerStats } from "../services/employerApi";

function EmployerDashboard() {
  const { user, logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setStatsLoading(true);

        const response = await getEmployerStats();

        setStats(response.data);
      } catch (error) {
        console.error("Failed to load employer stats:", error);
      } finally {
        setStatsLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total jobs",
      value: stats?.total_jobs || 0,
      href: "/employer/jobs",
    },
    {
      label: "Active jobs",
      value: stats?.active_jobs || 0,
      href: "/employer/jobs",
    },
    {
      label: "Total applications",
      value: stats?.total || 0,
      href: "/employer/applications",
    },
    {
      label: "Pending",
      value: stats?.pending || 0,
      color: "text-blue-600",
      href: "/employer/applications",
    },
    {
      label: "Shortlisted",
      value: stats?.shortlisted || 0,
      color: "text-emerald-600",
      href: "/employer/applications",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Employer Dashboard
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Welcome back, {user?.name?.split(" ")[0] || "Employer"}
              </h1>

              <p className="mt-2 text-slate-500">
                Manage your job postings and review candidate applications.
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

          <div className="mt-10 grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {statCards.map((card, index) => (
              <Link
                key={index}
                to={card.href}
                className="rounded-2xl bg-slate-50 p-5 transition hover:bg-slate-100"
              >
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
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <BriefcaseBusiness size={20} className="text-blue-600" />

              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Company
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

          <div className="mt-8 grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-6 sm:grid-cols-2">
            <Link
              to="/employer/jobs"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Manage Jobs
              <ArrowUpRight size={16} />
            </Link>

            <Link
              to="/employer/applications"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Review Applications
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployerDashboard;
