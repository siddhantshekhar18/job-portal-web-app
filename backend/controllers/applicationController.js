const path = require("path");
const {
  createApplication,
  findApplicationByUserAndJob,
  findApplicationsByUser,
  findApplicationByIdAndUser,
  getApplicationStats,
} = require("../services/applicationService");
const { getJobById: findJobById } = require("../services/jobService");

async function submitApplication(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume",
      });
    }

    const userId = req.user.id;
    const jobId = Number(req.body.job_id);

    const job = await findJobById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const existingApplication = await findApplicationByUserAndJob(userId, jobId);

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const application = await createApplication({
      userId,
      jobId,
      fullName: req.body.full_name.trim(),
      email: req.body.email.trim().toLowerCase(),
      phone: req.body.phone.trim(),
      resumePath: req.file.filename,
      coverLetter: req.body.cover_letter?.trim() || null,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    next(error);
  }
}

async function getMyApplications(req, res, next) {
  try {
    const applications = await findApplicationsByUser(req.user.id);

    res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
}

async function getApplicationById(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    const application = await findApplicationByIdAndUser(id, req.user.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
}

async function getStats(req, res, next) {
  try {
    const stats = await getApplicationStats(req.user.id);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  submitApplication,
  getMyApplications,
  getApplicationById,
  getStats,
};
