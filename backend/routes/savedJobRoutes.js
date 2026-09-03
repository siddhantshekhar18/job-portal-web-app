const express = require("express");
const authenticate = require("../middleware/authenticate");
const {
  getSavedJobs,
  addSavedJob,
  deleteSavedJob,
} = require("../controllers/savedJobController");

const router = express.Router();

module.exports = () => {
  router.use(authenticate);
  router.get("/", getSavedJobs);
  router.post("/:jobId", addSavedJob);
  router.delete("/:jobId", deleteSavedJob);
  return router;
};
