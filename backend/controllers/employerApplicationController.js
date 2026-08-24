const {
  findApplicationsByEmployer,
  findApplicationByIdAndEmployer,
  updateApplicationStatusByEmployer,
  getEmployerApplicationStats,
} = require("../services/applicationService");

const ALLOWED_STATUSES = [
  "pending",
  "reviewing",
  "shortlisted",
  "rejected",
  "accepted",
];

async function getApplications(req, res, next) {
  try {
    const isAdmin = req.user.role === "admin";

    const applications = await findApplicationsByEmployer(
      req.user.id,
      isAdmin,
    );

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

    const isAdmin = req.user.role === "admin";

    const application = await findApplicationByIdAndEmployer(
      id,
      req.user.id,
      isAdmin,
    );

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

async function updateApplicationStatus(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    const isAdmin = req.user.role === "admin";

    const application = await updateApplicationStatusByEmployer(
      id,
      status,
      req.user.id,
      isAdmin,
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      message: "Application status updated successfully",
      data: application,
    });
  } catch (error) {
    next(error);
  }
}

async function getStats(req, res, next) {
  try {
    const isAdmin = req.user.role === "admin";

    const stats = await getEmployerApplicationStats(req.user.id, isAdmin);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  getStats,
};
