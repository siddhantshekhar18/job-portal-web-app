const fs = require("fs/promises");
const path = require("path");
const pool = require("../config/db");

async function runMigrations() {
  const migrationsDirectory = path.join(__dirname, "..", "migrations");
  const migrationFiles = (await fs.readdir(migrationsDirectory))
    .filter((file) => /^\d+_.+\.sql$/.test(file))
    .sort();

  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const appliedResult = await client.query(
      "SELECT name FROM schema_migrations",
    );
    const applied = new Set(appliedResult.rows.map((row) => row.name));

    for (const file of migrationFiles) {
      if (applied.has(file)) continue;

      const sql = await fs.readFile(path.join(migrationsDirectory, file), "utf8");

      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [
          file,
        ]);
        await client.query("COMMIT");
        console.log(`Applied ${file}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw new Error(`Failed to apply ${file}: ${error.message}`);
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
