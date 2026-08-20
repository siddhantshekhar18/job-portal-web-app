import { BriefcaseBusiness, Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/10">
            <BriefcaseBusiness size={21} />
          </div>

          <span className="text-xl font-bold tracking-tight text-slate-950">
            Job<span className="text-blue-600">Portal</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="/"
            className="text-sm font-medium text-slate-950 transition hover:text-blue-600"
          >
            Home
          </a>

          <a
            href="/jobs"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Find Jobs
          </a>

          <a
            href="#companies"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Companies
          </a>

          <a
            href="#about"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            About
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <button className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
            Sign In
          </button>

          <button className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-blue-600">
            Post a Job
          </button>
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
            <a href="/" className="text-sm font-medium text-slate-900">
              Home
            </a>

            <a href="/jobs" className="text-sm font-medium text-slate-600">
              Find Jobs
            </a>

            <a href="#companies" className="text-sm font-medium text-slate-600">
              Companies
            </a>

            <a href="#about" className="text-sm font-medium text-slate-600">
              About
            </a>

            <div className="flex gap-3 border-t border-slate-200 pt-4">
              <button className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">
                Sign In
              </button>

              <button className="flex-1 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">
                Post a Job
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
