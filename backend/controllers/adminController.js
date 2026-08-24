const pool = require("../config/db");

async function getStats(req, res, next) {
  try {
    const userResult = await pool.query(
      `SELECT
         COUNT(*) AS total_users,
         COUNT(*) FILTER (WHERE role = 'candidate') AS candidates,
         COUNT(*) FILTER (WHERE role = 'employer') AS employers,
         COUNT(*) FILTER (WHERE role = 'admin') AS admins
       FROM users`,
    );

    const jobResult = await pool.query("SELECT COUNT(*) AS total_jobs FROM jobs");

    const applicationResult = await pool.query(
      `SELECT
         COUNT(*) AS total_applications,
         COUNT(*) FILTER (WHERE status = 'pending') AS pending,
         COUNT(*) FILTER (WHERE status = 'reviewing') AS reviewing,
         COUNT(*) FILTER (WHERE status = 'shortlisted') AS shortlisted,
         COUNT(*) FILTER (WHERE status = 'accepted') AS accepted,
         COUNT(*) FILTER (WHERE status = 'rejected') AS rejected
       FROM applications`,
    );

    res.json({
      success: true,
      data: {
        users: userResult.rows[0],
        jobs: jobResult.rows[0],
        applications: applicationResult.rows[0],
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getStats,
};
