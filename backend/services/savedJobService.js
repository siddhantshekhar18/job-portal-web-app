const pool = require("../config/db");

async function findSavedJobsByUser(userId) {
  const result = await pool.query(
    `SELECT j.*, s.created_at AS saved_at
     FROM saved_jobs s
     JOIN jobs j ON j.id = s.job_id
     WHERE s.user_id = $1
     ORDER BY s.created_at DESC`,
    [userId],
  );

  return result.rows;
}

async function saveJob(userId, jobId) {
  await pool.query(
    `INSERT INTO saved_jobs (user_id, job_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, job_id) DO NOTHING`,
    [userId, jobId],
  );
}

async function removeSavedJob(userId, jobId) {
  const result = await pool.query(
    "DELETE FROM saved_jobs WHERE user_id = $1 AND job_id = $2 RETURNING job_id",
    [userId, jobId],
  );

  return result.rows[0];
}

module.exports = { findSavedJobsByUser, saveJob, removeSavedJob };
