const express = require("express");
const authenticate = require("../middleware/authenticate");
const { validateApplication } = require("../middleware/applicationValidation");
const { uploadResume, handleUploadError } = require("../middleware/uploadResume");
const {
  submitApplication,
  getMyApplications,
  getApplicationById,
  getStats,
} = require("../controllers/applicationController");

const router = express.Router();

module.exports = () => {
  router.post(
    "/",
    authenticate,
    uploadResume,
    handleUploadError,
    validateApplication,
    submitApplication,
  );

  router.get("/my", authenticate, getMyApplications);
  router.get("/stats", authenticate, getStats);
  router.get("/:id", authenticate, getApplicationById);

  return router;
};
