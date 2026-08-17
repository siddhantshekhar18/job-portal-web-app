const {
  getAllJobs,
  getJobById: findJobById,
  createJob: addJob,
  updateJob: editJob,
  deleteJob: removeJob,
} = require("../services/jobService");

function getJobs() {
  return (req, res) => {
    const jobList = getAllJobs();
    res.json(jobList);
  };
}

function getJobById() {
  return (req, res) => {
    const id = Number(req.params.id);

    const job = findJobById(id);

    if (!job) {
      return res.status(404).json({
        message: "job not found",
      });
    }
    res.json(job);
  };
}

function createJob() {
  return (req, res) => {
    const newJob = addJob(req.body);
    res.status(201).json(newJob);
  };
}

function updateJob() {
  return (req, res) => {
    const id = Number(req.params.id);

    const updatedJob = editJob(id, req.body);

    if (!updatedJob) {
      return res.status(404).json({
        message: "Job not found",
      });
    }
    res.json(updatedJob);
  };
}

function deleteJob() {
  return (req, res) => {
    const id = Number(req.params.id);
    const deletedJob = removeJob(id);

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
