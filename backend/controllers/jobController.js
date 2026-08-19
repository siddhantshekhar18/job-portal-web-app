const {
  getAllJobs,
  getJobById: findJobById,
  createJob: addJob,
  updateJob: editJob,
  deleteJob: removeJob,
} = require("../services/jobService");

function getJobs() {
  return async (req, res, next) => {
    try {
      const jobList = await getAllJobs(
        req.jobQuery.search,
        req.jobQuery.location,
        req.jobQuery.minSalary,
        req.jobQuery.maxSalary,
        req.jobQuery.page,
        req.jobQuery.limit,
      );

      res.json(jobList);
    } catch (error) {
      next(error);
    }
  };
}

function getJobById() {
  return async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const job = await findJobById(id);

      if (!job) {
        return res.status(404).json({
          message: "Job not found",
        });
      }
      res.json(job);
    } catch (error) {
      next(error);
    }
  };
}

function createJob() {
  return async (req, res, next) => {
    try {
      const newJob = await addJob(req.body);
      res.status(201).json(newJob);
    } catch (error) {
      next(error);
    }
  };
}

function updateJob() {
  return async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      const updatedJob = await editJob(id, req.body);

      if (!updatedJob) {
        return res.status(404).json({
          message: "Job not found",
        });
      }
      res.json(updatedJob);
    } catch (error) {
      next(error);
    }
  };
}

function deleteJob() {
  return async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const deletedJob = await removeJob(id);

      if (!deletedJob) {
        return res.status(404).json({
          message: "Job not found",
        });
      }
      res.json({
        message: "Job deleted successfully",
        job: deletedJob,
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
