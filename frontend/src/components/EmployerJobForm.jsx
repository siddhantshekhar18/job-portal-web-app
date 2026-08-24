import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createEmployerJob,
  getEmployerJobById,
  updateEmployerJob,
} from "../services/employerApi";

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
];

const EXPERIENCE_LEVELS = [
  "Entry-level",
  "Mid-level",
  "Senior",
  "Lead",
  "Manager",
];

function TagInput({ label, tags, onChange, placeholder, error }) {
  const [input, setInput] = useState("");

  function addTag() {
    const trimmed = input.replace(/,/g, "").trim();

    if (!trimmed) {
      return;
    }

    if (!tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }

    setInput("");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag();
      return;
    }

    if (event.key === "Tab" && input.trim()) {
      event.preventDefault();
      addTag();
    }
  }

  function remove(tag) {
    onChange(tags.filter((t) => t !== tag));
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
          >
            {tag}

            <button
              type="button"
              onClick={() => remove(tag)}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
            >
              <X size={12} />
            </button>
          </span>
        ))}

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-w-[120px] flex-1 bg-transparent px-2 py-1.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />

        <button
          type="button"
          onClick={addTag}
          disabled={!input.trim()}
          className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
        >
          <Plus size={12} />
          Add
        </button>
      </div>

      <p className="mt-1.5 text-xs text-slate-400">
        Type a value and press Enter or click Add.
      </p>

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function EmployerJobForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    requirements: [],
    responsibilities: [],
    employment_type: "Full-time",
    experience_level: "Mid-level",
    skills: [],
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    async function fetchJob() {
      try {
        setLoading(true);
        setError("");

        const response = await getEmployerJobById(id);

        const job = response.data;

        setFormData({
          title: job.title || "",
          company: job.company || "",
          location: job.location || "",
          salary: job.salary?.toString() || "",
          description: job.description || "",
          requirements: Array.isArray(job.requirements) ? job.requirements : [],
          responsibilities: Array.isArray(job.responsibilities)
            ? job.responsibilities
            : [],
          employment_type: job.employment_type || "Full-time",
          experience_level: job.experience_level || "Mid-level",
          skills: Array.isArray(job.skills) ? job.skills : [],
        });
      } catch (error) {
        console.error(error);
        setError("Failed to load the job.");
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [id, isEdit]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({ ...current, [name]: value }));
    setFormErrors((current) => ({ ...current, [name]: "" }));
  }

  function validate() {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Job title is required.";
    }

    if (!formData.company.trim()) {
      errors.company = "Company name is required.";
    }

    if (!formData.location.trim()) {
      errors.location = "Location is required.";
    }

    const salaryNumber = Number(formData.salary);

    if (!formData.salary.trim() || Number.isNaN(salaryNumber) || salaryNumber <= 0) {
      errors.salary = "Please enter a valid salary.";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required.";
    }

    if (formData.requirements.length === 0) {
      errors.requirements = "At least one requirement is required.";
    }

    if (formData.responsibilities.length === 0) {
      errors.responsibilities = "At least one responsibility is required.";
    }

    if (formData.skills.length === 0) {
      errors.skills = "At least one skill is required.";
    }

    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const errors = validate();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setError("Please fix the highlighted fields before submitting.");

      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...formData,
        salary: Number(formData.salary),
      };

      if (isEdit) {
        await updateEmployerJob(id, payload);
      } else {
        await createEmployerJob(payload);
      }

      navigate("/employer/jobs");
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message ||
        "Failed to save the job. Please try again.";

      setError(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 size={28} className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <Link
          to="/employer/jobs"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to jobs
        </Link>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            {isEdit ? "Edit Job" : "Post a New Job"}
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {isEdit ? "Edit job posting" : "Create a job posting"}
          </h1>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Job title
                </label>

                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Frontend Developer"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                {formErrors.title && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {formErrors.title}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Company
                </label>

                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Acme Inc"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                {formErrors.company && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {formErrors.company}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Location
                </label>

                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                {formErrors.location && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {formErrors.location}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="employment_type"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Employment type
                </label>

                <select
                  id="employment_type"
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  {EMPLOYMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="experience_level"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Experience level
                </label>

                <select
                  id="experience_level"
                  name="experience_level"
                  value={formData.experience_level}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  {EXPERIENCE_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <label
                  htmlFor="salary"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Annual salary (₹)
                </label>

                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. 1200000"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                {formErrors.salary && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {formErrors.salary}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe the role and what the candidate will do..."
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

              {formErrors.description && (
                <p className="mt-1.5 text-xs text-red-600">
                  {formErrors.description}
                </p>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <TagInput
                label="Requirements"
                tags={formData.requirements}
                onChange={(tags) =>
                  setFormData((current) => ({ ...current, requirements: tags }))
                }
                placeholder="Add a requirement and press Enter"
                error={formErrors.requirements}
              />

              <TagInput
                label="Responsibilities"
                tags={formData.responsibilities}
                onChange={(tags) =>
                  setFormData((current) => ({
                    ...current,
                    responsibilities: tags,
                  }))
                }
                placeholder="Add a responsibility and press Enter"
                error={formErrors.responsibilities}
              />
            </div>

            <TagInput
              label="Skills"
              tags={formData.skills}
              onChange={(tags) =>
                setFormData((current) => ({ ...current, skills: tags }))
              }
              placeholder="Add a skill and press Enter"
              error={formErrors.skills}
            />

            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    {isEdit ? "Update Job" : "Post Job"}
                  </>
                )}
              </button>

              <Link
                to="/employer/jobs"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EmployerJobForm;
