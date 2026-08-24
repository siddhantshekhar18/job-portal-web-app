const {
  createJob,
  getJobById,
  updateJob,
  deleteJob,
  getAllJobs,
  findJobsByEmployer,
  findJobByIdAndEmployer,
  updateJobByEmployer,
  deleteJobByEmployer,
} = require("../services/jobService");

async function getMyJobs(req, res, next) {
  try {
    const isAdmin = req.user.role === "admin";

    const jobs = isAdmin
      ? (await getAllJobs()).data
      : await findJobsByEmployer(req.user.id);

    res.json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
}

async function getJobByIdForEmployer(req, res, next) {
  try {
    const id = Number(req.params.id);
    const isAdmin = req.user.role === "admin";

    const job = isAdmin
      ? await getJobById(id)
      : await findJobByIdAndEmployer(id, req.user.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
}

async function createEmployerJob(req, res, next) {
  try {
    const job = await createJob(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
}

async function updateEmployerJob(req, res, next) {
  try {
    const id = Number(req.params.id);
    const isAdmin = req.user.role === "admin";

    const existingJob = isAdmin
      ? await getJobById(id)
      : await findJobByIdAndEmployer(id, req.user.id);

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const updatedJob = isAdmin
      ? await updateJob(id, req.body)
      : await updateJobByEmployer(id, req.body, req.user.id);

    res.json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteEmployerJob(req, res, next) {
  try {
    const id = Number(req.params.id);
    const isAdmin = req.user.role === "admin";

    const existingJob = isAdmin
      ? await getJobById(id)
      : await findJobByIdAndEmployer(id, req.user.id);

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await (isAdmin ? deleteJob(id) : deleteJobByEmployer(id, req.user.id));

    res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMyJobs,
  getJobByIdForEmployer,
  createEmployerJob,
  updateEmployerJob,
  deleteEmployerJob,
};
