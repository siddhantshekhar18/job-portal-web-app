const pool = require("../config/db");

async function getAllJobs(
  search,
  location,
  minSalary,
  maxSalary,
  page,
  limit,
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

async function createJob(job) {
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
       skills
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
