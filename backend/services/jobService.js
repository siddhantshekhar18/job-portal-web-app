const jobs = require("../data/jobs");

function getAllJobs() {
  return jobs;
}

function getJobById(id) {
  return jobs.find((job) => job.id === id);
}

function createJob(jobData) {
  const newJob = {
    id: jobs.length + 1,
    title: jobData.title.trim(),
    company: jobData.company.trim(),
    location: jobData.location.trim(),
    salary: jobData.salary,
  };

  jobs.push(newJob);

  return newJob;
}

function updateJob(id, jobData) {
  const jobIndex = jobs.findIndex((job) => job.id === id);

  if (jobIndex === -1) {
    return null;
  }

  const updatedJob = {
    id: id,
    title: jobData.title.trim(),
    company: jobData.company.trim(),
    location: jobData.location.trim(),
    salary: jobData.salary,
  };

  jobs[jobIndex] = updatedJob;

  return updatedJob;
}

function deleteJob(id) {
  const jobIndex = jobs.findIndex((job) => job.id === id);

  if (jobIndex === -1) {
    return null;
  }

  const deletedJob = jobs.splice(jobIndex, 1);

  return deletedJob[0];
}

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
