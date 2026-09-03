import {
  BadgeIndianRupee,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Heart,
  Mail,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

const pages = {
  "saved-jobs": {
    eyebrow: "Candidate tools",
    title: "Keep great opportunities within reach.",
    description:
      "Save roles you want to revisit, compare them thoughtfully, and apply when your application is ready.",
    icon: Heart,
    primary: { label: "Browse jobs", to: "/" },
    sections: [
      ["Build a focused shortlist", "Save roles that match your skills, preferred location, and career goals."],
      ["Tailor every application", "Use the job description to adapt your resume and explain the value you can bring."],
      ["Stay organised", "Review your saved roles regularly so promising openings do not slip past their deadlines."],
    ],
  },
  "career-resources": {
    eyebrow: "Career resources",
    title: "Practical guidance for your next career move.",
    description:
      "Make a stronger first impression with clear applications, thoughtful preparation, and a profile that reflects your best work.",
    icon: BookOpenCheck,
    primary: { label: "Explore open roles", to: "/" },
    sections: [
      ["Create a clear resume", "Lead with relevant impact, use simple formatting, and keep your contact details current."],
      ["Prepare for interviews", "Research the company, practise role-specific examples, and prepare questions for the hiring team."],
      ["Apply with intention", "Prioritise roles where your experience and motivations align with the work being offered."],
    ],
  },
  "employer-solutions": {
    eyebrow: "For employers",
    title: "Build a stronger, more efficient hiring process.",
    description:
      "EasyJobs gives your team a focused place to publish opportunities, review candidate applications, and move hiring forward.",
    icon: Building2,
    primary: { label: "Post a job", to: "/employer/jobs/new" },
    sections: [
      ["Reach relevant talent", "Create clear job posts that explain the role, the team, and the skills that matter."],
      ["Review in one place", "See applications connected to your job posts and keep candidate details organised."],
      ["Make confident decisions", "Use a consistent process to evaluate applications and communicate the next step."],
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Start hiring with the tools your team needs.",
    description:
      "Publish opportunities and manage applications through a straightforward employer workspace.",
    icon: BadgeIndianRupee,
    primary: { label: "Create an employer account", to: "/register" },
    sections: [
      ["Job publishing", "Create complete listings with role details, requirements, location, and compensation."],
      ["Application management", "Review incoming applications and keep the hiring conversation moving."],
      ["Flexible for growing teams", "Start with the essentials and choose a hiring process that fits your organisation."],
    ],
  },
  "about-us": {
    eyebrow: "About EasyJobs",
    title: "Better connections between people and meaningful work.",
    description:
      "We are building a simpler job-search experience where candidates can find relevant roles and employers can meet capable people.",
    icon: Sparkles,
    primary: { label: "Browse jobs", to: "/" },
    sections: [
      ["Candidate-first", "We help job seekers discover roles with the information needed to make informed decisions."],
      ["Built for clarity", "From job posts to applications, we value direct language and an uncomplicated experience."],
      ["Growing together", "We support employers and candidates as they take the next important step."],
    ],
  },
  contact: {
    eyebrow: "Contact us",
    title: "We would love to hear from you.",
    description:
      "Whether you need help with an application, employer account, or a general question, send our support team a message.",
    icon: Mail,
    primary: { label: "Explore jobs", to: "/" },
    sections: [
      ["Candidates", "For help with your account or applications, include the email address linked to your profile."],
      ["Employers", "Tell us about your organisation and hiring needs so we can point you to the right next step."],
      ["General enquiries", "Email siddhantishekhar@gmail.com. We aim to respond with useful, clear guidance."],
    ],
  },
  privacy: {
    eyebrow: "Privacy policy",
    title: "Your information should stay in your control.",
    description:
      "This overview explains how EasyJobs uses the information needed to provide accounts, job applications, and employer tools.",
    icon: ShieldCheck,
    primary: { label: "Back to jobs", to: "/" },
    sections: [
      ["Information we collect", "Account details, application information, and resumes you choose to submit to a job."],
      ["How it is used", "To operate your account, process applications, and make submitted application details available to the relevant employer."],
      ["Your choices", "Keep your profile accurate and contact support if you need help with account information."],
    ],
  },
  terms: {
    eyebrow: "Terms of service",
    title: "Using EasyJobs responsibly.",
    description:
      "EasyJobs is a professional space for connecting candidates with employment opportunities and helping employers manage applications.",
    icon: Scale,
    primary: { label: "Browse jobs", to: "/" },
    sections: [
      ["Accurate information", "Provide truthful, current information in your account, job posts, and applications."],
      ["Professional use", "Use the platform for legitimate job-search and recruitment activities, with respect for other users."],
      ["Platform updates", "We may improve the service over time to keep it reliable, useful, and secure."],
    ],
  },
};

function FooterPage() {
  const { page } = useParams();
  const content = pages[page] || pages["about-us"];
  const Icon = content.icon;

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
              <Icon size={16} />
              {content.eyebrow}
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              {content.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {content.description}
            </p>
            <Link to={content.primary.to} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">
              {content.primary.label}
              <BriefcaseBusiness size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {content.sections.map(([heading, text]) => (
            <article key={heading} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <CheckCircle2 size={22} className="text-blue-600" />
              <h2 className="mt-5 text-lg font-bold text-slate-950">{heading}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default FooterPage;
