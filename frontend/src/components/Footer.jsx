import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <BriefcaseBusiness size={21} />
              </div>

              <span className="text-xl font-bold tracking-tight text-white">
                EasyJobs
              </span>
            </div>

            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">
              Discover meaningful career opportunities from companies building
              the future.
            </p>

            <div className="mt-6 flex items-center gap-3"></div>
          </div>

          {/* For Candidates */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              For Candidates
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Browse Jobs
                </Link>
              </li>

              <li>
                <Link
                  to="/footer/saved-jobs"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Saved Jobs
                </Link>
              </li>

              <li>
                <Link
                  to="/dashboard/applications"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Applications
                </Link>
              </li>

              <li>
                <Link
                  to="/footer/career-resources"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Career Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              For Employers
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/employer/jobs/new"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Post a Job
                </Link>
              </li>

              <li>
                <Link
                  to="/employer/applications"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Find Candidates
                </Link>
              </li>

              <li>
                <Link
                  to="/footer/employer-solutions"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Employer Solutions
                </Link>
              </li>

              <li>
                <Link
                  to="/footer/pricing"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/footer/about-us"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/footer/contact"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  to="/footer/privacy"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/footer/terms"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="border-t border-slate-800 py-8">
          <div className="flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">
                Ready for your next opportunity?
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Find your next role and take the next step in your career.
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Explore Jobs
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-3 border-t border-slate-800 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-500">
            © {new Date().getFullYear()} EasyJob. All rights reserved.
          </p>

          <p className="text-slate-600">Built for better careers.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
