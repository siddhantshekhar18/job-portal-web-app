import { RotateCcw, X } from "lucide-react";
import { useState } from "react";

function FilterPanel({ query, onApply, onClose }) {
  const [location, setLocation] = useState(query.location || "");
  const [minSalary, setMinSalary] = useState(query.minSalary || "");
  const [maxSalary, setMaxSalary] = useState(query.maxSalary || "");
  const [sort, setSort] = useState(query.sort || "");

  function handleApply() {
    onApply({
      location: location.trim() || undefined,
      minSalary: minSalary ? Number(minSalary) : undefined,
      maxSalary: maxSalary ? Number(maxSalary) : undefined,
      sort: sort || undefined,
      page: 1,
    });
  }

  function handleReset() {
    setLocation("");
    setMinSalary("");
    setMaxSalary("");
    setSort("");

    onApply({
      location: undefined,
      minSalary: undefined,
      maxSalary: undefined,
      sort: undefined,
      page: 1,
    });

    if (onClose) {
      onClose();
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-950">Filters</h3>

          <p className="mt-1 text-sm text-slate-500">Refine your job search</p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Location */}
      <div className="mt-7">
        <label
          htmlFor="filter-location"
          className="text-sm font-semibold text-slate-800"
        >
          Location
        </label>

        <input
          id="filter-location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Hyderabad"
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />
      </div>

      {/* Salary */}
      <div className="mt-6">
        <label className="text-sm font-semibold text-slate-800">
          Salary range
        </label>

        <div className="mt-2 grid grid-cols-2 gap-3">
          <input
            type="number"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
            placeholder="Min salary"
            min="1"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />

          <input
            type="number"
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
            placeholder="Max salary"
            min="1"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </div>
      </div>

      {/* Sort */}
      <div className="mt-6">
        <label
          htmlFor="filter-sort"
          className="text-sm font-semibold text-slate-800"
        >
          Sort by salary
        </label>

        <select
          id="filter-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="mt-2 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        >
          <option value="">Default</option>
          <option value="salary_desc">Highest salary</option>
          <option value="salary_asc">Lowest salary</option>
        </select>
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-3">
        <button
          onClick={handleApply}
          className="flex-1 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          Apply Filters
        </button>

        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </div>
  );
}

export default FilterPanel;
