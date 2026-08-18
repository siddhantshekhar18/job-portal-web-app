const pool = require("../config/db");

async function getAllJobs(search, location, minSalary, maxSalary) {
  let query = "SELECT * FROM jobs";
  const values = [];
  const conditions = [];

  if (search) {
    values.push(`%${search}%`);
    conditions.push(
      `(LOWER(title) LIKE LOWER($${values.length}) OR LOWER(company) LIKE LOWER($${values.length}))`,
    );
  }

  if (location) {
    values.push(location);
    conditions.push(`LOWER(location) = LOWER($${values.length})`);
  }

  if (minSalary) {
    values.push(minSalary);
    conditions.push(`salary >= $${values.length}`);
  }

  if (maxSalary) {
    values.push(maxSalary);
    conditions.push(`salary <= $${values.length}`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }
  const result = await pool.query(query, values);

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
