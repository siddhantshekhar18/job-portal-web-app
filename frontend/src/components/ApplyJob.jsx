import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Upload,
  User,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getJobById } from "../services/jobApi";
import { submitApplication } from "../services/applicationApi";
import { useAuth } from "../hooks/useAuth";

function ApplyJob() {
  const { id } = useParams();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [jobError, setJobError] = useState("");

  const [formData, setFormData] = useState({
    full_name: user?.name || "",
    email: user?.email || "",
    phone: "",
    cover_letter: "",
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      try {
        setJobLoading(true);
        setJobError("");

        const response = await getJobById(id);

        setJob(response.data);
      } catch (error) {
        console.error(error);
        setJobError("Failed to load this job.");
      } finally {
        setJobLoading(false);
      }
    }

    fetchJob();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({ ...current, [name]: value }));
    setFormErrors((current) => ({ ...current, [name]: "" }));
    setSubmitError("");
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0] || null;

    setResumeFile(file);
    setFormErrors((current) => ({ ...current, resume: "" }));
    setSubmitError("");
  }

  function validate() {
    const errors = {};

    if (!formData.full_name.trim()) {
      errors.full_name = "Full name is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      errors.email = "Please enter your email address.";
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Please enter your phone number.";
    } else if (!/^\+?[\d\s\-()]{7,20}$/.test(formData.phone.trim())) {
      errors.phone = "Please enter a valid phone number.";
    }

    if (!resumeFile) {
      errors.resume = "Please upload your resume.";
    }

    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitError("");

    const errors = validate();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);

      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();

      data.append("job_id", id);
      data.append("full_name", formData.full_name.trim());
      data.append("email", formData.email.trim());
      data.append("phone", formData.phone.trim());
      data.append("resume", resumeFile);

      if (formData.cover_letter.trim()) {
        data.append("cover_letter", formData.cover_letter.trim());
      }

      await submitApplication(data);

      setSubmitted(true);
    } catch (error) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      if (status === 409) {
        setSubmitError("You have already applied for this job.");
      } else {
        setSubmitError(message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (jobLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-5 w-32 rounded bg-slate-200" />
            <div className="h-64 rounded-3xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (jobError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-xl font-bold text-red-800">Unable to load job</h2>

          <p className="mt-2 text-sm text-red-600">{jobError}</p>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            <ArrowLeft size={17} />
            Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Job not found</h2>

          <p className="mt-2 text-sm text-slate-500">
            The job you are looking for does not exist or has been removed.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            <ArrowLeft size={17} />
            Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <div className="rounded-3xl border border-green-200 bg-white p-10 text-center shadow-sm sm:p-14">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-950">
              Application submitted successfully
            </h2>

            <p className="mt-3 text-slate-600">
              Your application for <strong>{job.title}</strong> at{" "}
              <strong>{job.company}</strong> has been received. You can track
              its status from your dashboard.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/dashboard/applications"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                View Applications
              </Link>

              <Link
                to={`/jobs/${job.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <ArrowLeft size={17} />
                Back to job
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <Link
          to={`/jobs/${job.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to job
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Application form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-xl font-bold text-white shadow-lg">
                {job.company?.charAt(0)?.toUpperCase()}
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Apply for {job.title}
                </h1>

                <p className="mt-1 text-slate-500">
                  Complete the form below to apply at {job.company}.
                </p>
              </div>
            </div>

            {submitError && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {submitError}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
              noValidate
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="full_name"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Full name
                  </label>

                  <div className="relative mt-2">
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {formErrors.full_name && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {formErrors.full_name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Email address
                  </label>

                  <div className="relative mt-2">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {formErrors.email && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Phone number
                  </label>

                  <div className="relative mt-2">
                    <Phone
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {formErrors.phone && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="resume"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Resume
                  </label>

                  <div className="relative mt-2">
                    <Upload
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-slate-700"
                    />
                  </div>

                  {formErrors.resume ? (
                    <p className="mt-1.5 text-xs text-red-600">
                      {formErrors.resume}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs text-slate-400">
                      PDF, DOC, or DOCX up to 5 MB
                    </p>
                  )}

                  {resumeFile && (
                    <p className="mt-1.5 text-xs text-green-600">
                      Selected: {resumeFile.name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="cover_letter"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Cover letter{" "}
                  <span className="font-normal text-slate-400">(optional)</span>
                </label>

                <div className="relative mt-2">
                  <FileText
                    size={18}
                    className="absolute left-3 top-3 text-slate-400"
                  />

                  <textarea
                    id="cover_letter"
                    name="cover_letter"
                    value={formData.cover_letter}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Tell us why you are a great fit for this role..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Submitting application...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </form>
          </div>

          {/* Job summary */}
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <BriefcaseBusiness size={22} />
              </div>

              <div>
                <h2 className="font-bold text-slate-950">{job.title}</h2>

                <p className="text-sm text-slate-500">{job.company}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-600" />
                {job.location}
              </div>

              <div className="flex items-center gap-2">
                <BriefcaseBusiness size={16} className="text-blue-600" />
                {job.employment_type || "Full-time"}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">Salary:</span>
                ₹{Number(job.salary).toLocaleString("en-IN")} / year
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ApplyJob;
