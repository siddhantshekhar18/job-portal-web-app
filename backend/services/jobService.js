const pool = require("../config/db");

async function getAllJobs(
  search,
  location,
  minSalary,
  maxSalary,
  page = 1,
  limit = 10,
  sort,
) {
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

  const countValues = [...values];
  let countQuery = "SELECT COUNT(*) FROM jobs";
  if (conditions.length > 0) {
    countQuery += " WHERE " + conditions.join(" AND ");
  }

  const countResult = await pool.query(countQuery, countValues);
  const totalCount = parseInt(countResult.rows[0].count);

  const totalPages = Math.ceil(totalCount / limit);

  if (sort === "salary_asc") {
    query += " ORDER BY salary ASC, id ASC";
  } else if (sort === "salary_desc") {
    query += " ORDER BY salary DESC, id ASC";
  } else {
    query += " ORDER BY id ASC";
  }

  const offset = (page - 1) * limit;

  values.push(limit);
  query += ` LIMIT $${values.length}`;

  values.push(offset);
  query += ` OFFSET $${values.length}`;

  const result = await pool.query(query, values);

  return {
    success: true,
    data: result.rows,
    pagination: {
      page,
      limit,
      totalJobs: totalCount,
      totalPages,
    },
  };
}

async function getJobById(id) {
  const result = await pool.query("SELECT * FROM jobs WHERE id = $1", [id]);

  return result.rows[0];
}

async function createJob(job, employerId) {
  const {
    title,
    company,
    location,
    salary,
    description,
    requirements,
    responsibilities,
    employment_type,
    experience_level,
    skills,
  } = job;

  const result = await pool.query(
    `INSERT INTO jobs (
       title,
       company,
       location,
       salary,
       description,
       requirements,
       responsibilities,
       employment_type,
       experience_level,
       skills,
       employer_id
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [
      title,
      company,
      location,
      salary,
      description ?? null,
      JSON.stringify(requirements ?? []),
      JSON.stringify(responsibilities ?? []),
      employment_type ?? null,
      experience_level ?? null,
      JSON.stringify(skills ?? []),
      employerId,
    ],
  );

  return result.rows[0];
}

async function updateJob(id, jobData) {
  const {
    title,
    company,
    location,
    salary,
    description,
    requirements,
    responsibilities,
    employment_type,
    experience_level,
    skills,
  } = jobData;

  const result = await pool.query(
    `UPDATE jobs
     SET title = COALESCE($1, title),
         company = COALESCE($2, company),
         location = COALESCE($3, location),
         salary = COALESCE($4, salary),
         description = COALESCE($5, description),
         requirements = COALESCE($6, requirements),
         responsibilities = COALESCE($7, responsibilities),
         employment_type = COALESCE($8, employment_type),
         experience_level = COALESCE($9, experience_level),
         skills = COALESCE($10, skills)
     WHERE id = $11
     RETURNING *`,
    [
      title ?? null,
      company ?? null,
      location ?? null,
      salary ?? null,
      description ?? null,
      requirements !== undefined ? JSON.stringify(requirements) : null,
      responsibilities !== undefined ? JSON.stringify(responsibilities) : null,
      employment_type ?? null,
      experience_level ?? null,
      skills !== undefined ? JSON.stringify(skills) : null,
      id,
    ],
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

async function findJobsByEmployer(employerId) {
  const result = await pool.query(
    `SELECT
       j.id,
       j.title,
       j.company,
       j.location,
       j.salary,
       j.employment_type,
       COUNT(a.id) AS application_count
     FROM jobs j
     LEFT JOIN applications a ON a.job_id = j.id
     WHERE j.employer_id = $1
     GROUP BY j.id
     ORDER BY j.id DESC`,
    [employerId],
  );

  return result.rows;
}

async function findJobByIdAndEmployer(id, employerId) {
  const result = await pool.query(
    "SELECT * FROM jobs WHERE id = $1 AND employer_id = $2",
    [id, employerId],
  );

  return result.rows[0];
}

async function updateJobByEmployer(id, jobData, employerId) {
  const {
    title,
    company,
    location,
    salary,
    description,
    requirements,
    responsibilities,
    employment_type,
    experience_level,
    skills,
  } = jobData;

  const result = await pool.query(
    `UPDATE jobs
     SET title = $1,
         company = $2,
         location = $3,
         salary = $4,
         description = $5,
         requirements = $6,
         responsibilities = $7,
         employment_type = $8,
         experience_level = $9,
         skills = $10
     WHERE id = $11 AND employer_id = $12
     RETURNING *`,
    [
      title,
      company,
      location,
      salary,
      description ?? null,
      JSON.stringify(requirements ?? []),
      JSON.stringify(responsibilities ?? []),
      employment_type ?? null,
      experience_level ?? null,
      JSON.stringify(skills ?? []),
      id,
      employerId,
    ],
  );

  return result.rows[0];
}

async function deleteJobByEmployer(id, employerId) {
  const result = await pool.query(
    "DELETE FROM jobs WHERE id = $1 AND employer_id = $2 RETURNING *",
    [id, employerId],
  );

  return result.rows[0];
}

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  findJobsByEmployer,
  findJobByIdAndEmployer,
  updateJobByEmployer,
  deleteJobByEmployer,
};
