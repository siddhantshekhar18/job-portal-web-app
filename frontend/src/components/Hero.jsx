import { useState } from "react";
import { ArrowRight, MapPin, Search } from "lucide-react";

function Hero({ onSearch }) {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* Background decoration */}
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Thousands of opportunities waiting for you
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl">
            Find work that
            <span className="block text-blue-400">moves you forward.</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Discover meaningful opportunities from growing startups, innovative
            companies, and global organizations.
          </p>

          {/* Search */}
          <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-white/10 bg-white/10 p-2 shadow-2xl backdrop-blur-xl">
            <div className="grid gap-2 md:grid-cols-[1fr_0.8fr_auto]">
              {/* Search input */}
              <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3.5">
                <Search className="shrink-0 text-slate-400" size={20} />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Job title, keyword or company"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3.5">
                <MapPin className="shrink-0 text-slate-400" size={20} />

                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              {/* Search button */}
              <button
                onClick={() => {
                  onSearch({
                    search: search.trim() || undefined,
                    location: location.trim() || undefined,
                  });
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Search Jobs
                <ArrowRight size={17} />
              </button>
            </div>
          </div>

          {/* Popular searches */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-slate-500">Popular:</span>

            <button className="rounded-full border border-white/10 px-3 py-1.5 text-slate-400 transition hover:border-blue-400/50 hover:text-blue-300">
              Frontend Developer
            </button>

            <button className="rounded-full border border-white/10 px-3 py-1.5 text-slate-400 transition hover:border-blue-400/50 hover:text-blue-300">
              Full Stack
            </button>

            <button className="rounded-full border border-white/10 px-3 py-1.5 text-slate-400 transition hover:border-blue-400/50 hover:text-blue-300">
              AI Engineer
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-20 grid max-w-3xl grid-cols-2 border-t border-white/10 pt-8 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">10K+</div>
            <div className="mt-1 text-sm text-slate-500">Jobs</div>
          </div>

          <div className="border-l border-white/10 text-center">
            <div className="text-2xl font-bold text-white">2K+</div>
            <div className="mt-1 text-sm text-slate-500">Companies</div>
          </div>

          <div className="border-l border-white/10 text-center">
            <div className="text-2xl font-bold text-white">50K+</div>
            <div className="mt-1 text-sm text-slate-500">Candidates</div>
          </div>

          <div className="border-l border-white/10 text-center">
            <div className="text-2xl font-bold text-white">25+</div>
            <div className="mt-1 text-sm text-slate-500">Industries</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
