const express = require("express");

const { validateJobId, validateJob } = require("../middleware/jobValidation");
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const router = express.Router();

module.exports = (jobs) => {
  router.get("/", getJobs(jobs));

  router.get("/:id", validateJobId, getJobById(jobs));

  router.post("/", validateJob, createJob(jobs));

  router.put("/:id", validateJobId, validateJob, updateJob(jobs));

  router.delete("/:id", validateJobId, deleteJob(jobs));

  return router;
};
