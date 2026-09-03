const express = require("express");
const authenticate = require("../middleware/authenticate");
const { validateJobId, validateJob } = require("../middleware/jobValidation");
const {
  getMyJobs,
  getJobByIdForEmployer,
  createEmployerJob,
  updateEmployerJob,
  deleteEmployerJob,
} = require("../controllers/employerJobController");

const router = express.Router();

module.exports = () => {
  router.use(authenticate);

  router.get("/", getMyJobs);
  router.get("/:id", validateJobId, getJobByIdForEmployer);
  router.post("/", validateJob, createEmployerJob);
  router.put("/:id", validateJobId, validateJob, updateEmployerJob);
  router.delete("/:id", validateJobId, deleteEmployerJob);

  return router;
};
