const { getJobById } = require("../services/jobService");
const {
  findSavedJobsByUser,
  saveJob,
  removeSavedJob,
} = require("../services/savedJobService");

function parseJobId(value) {
  const jobId = Number(value);
  return Number.isInteger(jobId) && jobId > 0 ? jobId : null;
}

async function getSavedJobs(req, res, next) {
  try {
    const jobs = await findSavedJobsByUser(req.user.id);
    res.json({ success: true, data: jobs });
  } catch (error) {
    next(error);
  }
}

async function addSavedJob(req, res, next) {
  try {
    const jobId = parseJobId(req.params.jobId);
    if (!jobId) {
      return res.status(400).json({ success: false, message: "Invalid job ID" });
    }

    const job = await getJobById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    await saveJob(req.user.id, jobId);
    res.status(201).json({ success: true, message: "Job saved successfully" });
  } catch (error) {
    next(error);
  }
}

async function deleteSavedJob(req, res, next) {
  try {
    const jobId = parseJobId(req.params.jobId);
    if (!jobId) {
      return res.status(400).json({ success: false, message: "Invalid job ID" });
    }

    const removed = await removeSavedJob(req.user.id, jobId);
    if (!removed) {
      return res.status(404).json({ success: false, message: "Saved job not found" });
    }

    res.json({ success: true, message: "Job removed from saved jobs" });
  } catch (error) {
    next(error);
  }
}

module.exports = { getSavedJobs, addSavedJob, deleteSavedJob };
