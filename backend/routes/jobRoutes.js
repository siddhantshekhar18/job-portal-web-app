const express = require("express");
const { validateJobId } = require("../middleware/jobValidation");
const validateJobQuery = require("../middleware/jobQueryValidation");
const {
  getJobs,
  getJobById,
} = require("../controllers/jobController");
const router = express.Router();
module.exports = () => {
  router.get("/", validateJobQuery, getJobs());
  router.get("/:id", validateJobId, getJobById());
  return router;
};
