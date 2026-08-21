const pool = require("../config/db");

async function createApplication({
  userId,
  jobId,
  fullName,
  email,
  phone,
  resumePath,
  coverLetter,
}) {
  const result = await pool.query(
    `INSERT INTO applications (
       user_id,
       job_id,
       full_name,
       email,
       phone,
       resume_path,
       cover_letter
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, job_id, status, created_at`,
    [userId, jobId, fullName, email, phone, resumePath, coverLetter || null],
  );

  return result.rows[0];
}

async function findApplicationByUserAndJob(userId, jobId) {
  const result = await pool.query(
    "SELECT id FROM applications WHERE user_id = $1 AND job_id = $2",
    [userId, jobId],
  );

  return result.rows[0];
}

async function findApplicationsByUser(userId) {
  const result = await pool.query(
    `SELECT
       a.id,
       a.job_id,
       j.title AS job_title,
       j.company,
       j.location,
       j.salary,
       a.status,
       a.created_at,
       a.full_name,
       a.email,
       a.phone,
       a.resume_path,
       a.cover_letter
     FROM applications a
     JOIN jobs j ON a.job_id = j.id
     WHERE a.user_id = $1
     ORDER BY a.created_at DESC`,
    [userId],
  );

  return result.rows;
}

async function findApplicationByIdAndUser(id, userId) {
  const result = await pool.query(
    `SELECT
       a.id,
       a.job_id,
       j.title AS job_title,
       j.company,
       j.location,
       j.salary,
       j.description AS job_description,
       a.full_name,
       a.email,
       a.phone,
       a.resume_path,
       a.cover_letter,
       a.status,
       a.created_at,
       a.updated_at
     FROM applications a
     JOIN jobs j ON a.job_id = j.id
     WHERE a.id = $1 AND a.user_id = $2`,
    [id, userId],
  );

  return result.rows[0];
}

async function getApplicationStats(userId) {
  const result = await pool.query(
    `SELECT
       COUNT(*) AS total,
       COUNT(*) FILTER (WHERE status = 'pending') AS pending,
       COUNT(*) FILTER (WHERE status = 'reviewing') AS reviewing,
       COUNT(*) FILTER (WHERE status = 'shortlisted') AS shortlisted,
       COUNT(*) FILTER (WHERE status = 'accepted') AS accepted,
       COUNT(*) FILTER (WHERE status = 'rejected') AS rejected
     FROM applications
     WHERE user_id = $1`,
    [userId],
  );

  return result.rows[0];
}

module.exports = {
  createApplication,
  findApplicationByUserAndJob,
  findApplicationsByUser,
  findApplicationByIdAndUser,
  getApplicationStats,
};
