const express = require("express");
const { validateJobId, validateJob } = require("./middleware/jobValidation");
const app = express();

const jobRoutes = require("./routes/jobRoutes");

const PORT = 3000;

app.use(express.json());

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "Remote",
    salary: 60000,
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "CodeLabs",
    location: "Bangalore",
    salary: 70000,
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "InnovateTech",
    location: "Hyderabad",
    salary: 80000,
  },
  {
    id: 4,
    title: "Software Developer Intern",
    company: "LinkWorks Labs",
    location: "Greater Chennai",
    salary: 90000,
  },
];

app.use("/api/jobs", jobRoutes(jobs));

app.get("/", (req, res) => {
  res.json({
    message: "Job portal API is running",
  });
});

app.delete("/api/jobs/:id", validateJobId, (req, res) => {
  const id = Number(req.params.id);
  const jobIndex = jobs.findIndex((job) => job.id === id);

  if (jobIndex === -1) {
    return res.status(404).json({
      message: "Job not found",
    });
  }

  const deletedJob = jobs.splice(jobIndex, 1);
  res.json({
    message: "Job deleted successfully",
    job: deletedJob[0],
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
