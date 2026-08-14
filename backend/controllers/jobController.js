const {
  getAllJobs,
  getJobById: findJobById,
  createJob: addJob,
  updateJob: editJob,
  deleteJob: removeJob,
} = require("../services/jobService");

function getJobs(jobs) {
  return (req, res) => {
    const jobList = getAllJobs(jobs);
    res.json(jobList);
  };
}

function getJobById(jobs) {
  return (req, res) => {
    const id = Number(req.params.id);

    const job = findJobById(jobs, id);

    if (!job) {
      return res.status(404).json({
        message: "job not found",
      });
    }
    res.json(job);
  };
}

function createJob(jobs) {
  return (req, res) => {
    const newJob = addJob(jobs, req.body);
    res.status(201).json(newJob);
  };
}

function updateJob(jobs) {
  return (req, res) => {
    const id = Number(req.params.id);

    const updatedJob = editJob(jobs, id, req.body);

    if (!updatedJob) {
      return res.status(404).json({
        message: "job not found",
      });
    }
    res.json(updatedJob);
  };
}

function deleteJob(jobs) {
  return (req, res) => {
    const id = Number(req.params.id);
    const deletedJob = removeJob(jobs, id);

    if (!deletedJob) {
      return res.status(404).json({
        message: "Job not found",
      });
    }
    res.json({
      message: "Job deleted successfully",
      job: deletedJob,
    });
  };
}

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
