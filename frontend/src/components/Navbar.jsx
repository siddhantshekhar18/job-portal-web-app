import {
  BriefcaseBusiness,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Shield,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const role = user?.role || "candidate";

  const dashboardLink =
    role === "admin"
      ? "/admin/dashboard"
      : role === "employer"
        ? "/employer/dashboard"
        : "/dashboard";

  const isEmployer = role === "employer" || role === "admin";
  const isAdmin = role === "admin";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/10">
            <BriefcaseBusiness size={21} />
          </div>

          <span className="text-xl font-bold tracking-tight text-slate-950">
            Easy<span className="text-blue-600">Jobs</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-slate-950 transition hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Find Jobs
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to={dashboardLink}
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                Dashboard
              </Link>

              {role === "candidate" && (
                <Link
                  to="/dashboard/applications"
                  className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
                >
                  Applications
                </Link>
              )}

              {isEmployer && (
                <>
                  <Link
                    to="/employer/jobs"
                    className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
                  >
                    My Jobs
                  </Link>

                  <Link
                    to="/employer/applications"
                    className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
                  >
                    Applications
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {loading ? (
            <Loader2 size={20} className="animate-spin text-slate-400" />
          ) : isAuthenticated ? (
            <>
              <Link
                to={dashboardLink}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                {isAdmin ? (
                  <Shield size={17} className="text-amber-600" />
                ) : (
                  <User size={17} />
                )}
                {user?.name?.split(" ")[0] || "Account"}
              </Link>

              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <LogOut size={17} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-blue-600"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-5 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-900"
            >
              Home
            </Link>

            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-600"
            >
              Find Jobs
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to={dashboardLink}
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-600"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>

                {role === "candidate" && (
                  <Link
                    to="/dashboard/applications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-slate-600"
                  >
                    Applications
                  </Link>
                )}

                {isEmployer && (
                  <>
                    <Link
                      to="/employer/jobs"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-medium text-slate-600"
                    >
                      My Jobs
                    </Link>

                    <Link
                      to="/employer/applications"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-medium text-slate-600"
                    >
                      Applications
                    </Link>
                  </>
                )}
              </>
            )}

            <div className="flex gap-3 border-t border-slate-200 pt-4">
              {loading ? null : isAuthenticated ? (
                <>
                  <Link
                    to={dashboardLink}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700"
                  >
                    {user?.name?.split(" ")[0] || "Account"}
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 rounded-xl bg-slate-950 px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
