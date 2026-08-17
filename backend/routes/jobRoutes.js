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
module.exports = () => {
  router.get("/", getJobs());
  router.get("/:id", validateJobId, getJobById());
  router.post("/", validateJob, createJob());
  router.put("/:id", validateJobId, validateJob, updateJob());
  router.delete("/:id", validateJobId, deleteJob());
  return router;
};
