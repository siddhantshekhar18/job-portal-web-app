const express = require("express");
const authenticate = require("../middleware/authenticate");
const authorizeRoles = require("../middleware/authorizeRoles");
const {
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  getStats,
} = require("../controllers/employerApplicationController");

const router = express.Router();

module.exports = () => {
  router.use(authenticate);
  router.use(authorizeRoles("employer", "admin"));

  router.get("/", getApplications);
  router.get("/stats", getStats);
  router.get("/:id", getApplicationById);
  router.patch("/:id/status", updateApplicationStatus);

  return router;
};
