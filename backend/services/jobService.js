const pool = require("../config/db");

async function getAllJobs(location) {
  if (location) {
    const result = await pool.query(
      "SELECT * FROM jobs WHERE LOWER(location) = LOWER($1)",
      [location],
    );

    return result.rows;
  }
  const result = await pool.query("SELECT * FROM jobs");

  return result.rows;
}

async function getJobById(id) {
  const result = await pool.query("SELECT * FROM jobs WHERE id = $1", [id]);

  return result.rows[0];
}

async function createJob(job) {
  const { title, company, location, salary } = job;

  const result = await pool.query(
    `INSERT INTO jobs (title, company, location, salary)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, company, location, salary],
  );

  return result.rows[0];
}

async function updateJob(id, jobData) {
  const { title, company, location, salary } = jobData;

  const result = await pool.query(
    `UPDATE jobs
     SET title = $1,
         company = $2,
         location = $3,
         salary = $4
     WHERE id = $5
     RETURNING *`,
    [title, company, location, salary, id],
  );

  return result.rows[0];
}

async function deleteJob(id) {
  const result = await pool.query(
    "DELETE FROM jobs WHERE id = $1 RETURNING *",
    [id],
  );

  return result.rows[0];
}

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
