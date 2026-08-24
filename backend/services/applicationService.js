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

async function findApplicationsByEmployer(employerId, isAdmin = false) {
  let query = `
    SELECT
      a.id,
      a.job_id,
      j.title AS job_title,
      j.company,
      j.location,
      a.user_id,
      a.full_name,
      a.email,
      a.phone,
      a.status,
      a.created_at,
      a.resume_path
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
  `;

  const values = [];

  if (!isAdmin) {
    query += " WHERE j.employer_id = $1";
    values.push(employerId);
  }

  query += " ORDER BY a.created_at DESC";

  const result = await pool.query(query, values);

  return result.rows;
}

async function findApplicationByIdAndEmployer(id, employerId, isAdmin = false) {
  let query = `
    SELECT
      a.id,
      a.job_id,
      j.title AS job_title,
      j.company,
      j.location,
      j.salary,
      a.user_id,
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
    WHERE a.id = $1
  `;

  const values = [id];

  if (!isAdmin) {
    query += " AND j.employer_id = $2";
    values.push(employerId);
  }

  const result = await pool.query(query, values);

  return result.rows[0];
}

async function updateApplicationStatusByEmployer(
  id,
  status,
  employerId,
  isAdmin = false,
) {
  let query = `
    UPDATE applications
    SET status = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
  `;

  const values = [status, id];

  if (!isAdmin) {
    query += `
      AND job_id IN (
        SELECT id FROM jobs WHERE employer_id = $3
      )
    `;
    values.push(employerId);
  }

  query += " RETURNING id, job_id, status";

  const result = await pool.query(query, values);

  return result.rows[0];
}

async function getEmployerApplicationStats(employerId, isAdmin = false) {
  let applicationQuery = `
    SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE a.status = 'pending') AS pending,
      COUNT(*) FILTER (WHERE a.status = 'reviewing') AS reviewing,
      COUNT(*) FILTER (WHERE a.status = 'shortlisted') AS shortlisted,
      COUNT(*) FILTER (WHERE a.status = 'accepted') AS accepted,
      COUNT(*) FILTER (WHERE a.status = 'rejected') AS rejected
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
  `;

  const applicationValues = [];

  if (!isAdmin) {
    applicationQuery += " WHERE j.employer_id = $1";
    applicationValues.push(employerId);
  }

  const applicationResult = await pool.query(
    applicationQuery,
    applicationValues,
  );

  let jobsQuery = "SELECT COUNT(*) AS total_jobs FROM jobs";
  const jobsValues = [];

  if (!isAdmin) {
    jobsQuery += " WHERE employer_id = $1";
    jobsValues.push(employerId);
  }

  const jobsResult = await pool.query(jobsQuery, jobsValues);

  return {
    ...applicationResult.rows[0],
    total_jobs: jobsResult.rows[0].total_jobs,
    active_jobs: jobsResult.rows[0].total_jobs,
  };
}

module.exports = {
  createApplication,
  findApplicationByUserAndJob,
  findApplicationsByUser,
  findApplicationByIdAndUser,
  getApplicationStats,
  findApplicationsByEmployer,
  findApplicationByIdAndEmployer,
  updateApplicationStatusByEmployer,
  getEmployerApplicationStats,
};
