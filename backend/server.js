const express = require("express");
const fs = require("fs");
const path = require("path");
const pool = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { configureCors, createRateLimiter, securityHeaders } = require("./middleware/security");
const app = express();

const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const employerJobRoutes = require("./routes/employerJobRoutes");
const employerApplicationRoutes = require("./routes/employerApplicationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const savedJobRoutes = require("./routes/savedJobRoutes");

const PORT = Number(process.env.PORT) || 3000;
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const frontendDirectory = path.join(__dirname, "..", "frontend", "dist");

if (process.env.TRUST_PROXY === "true") app.set("trust proxy", 1);

app.disable("x-powered-by");
app.use(securityHeaders);
app.use(configureCors(allowedOrigins));
app.use(express.json({ limit: "1mb" }));

const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many authentication attempts. Please try again later.",
});
const writeRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 120,
  message: "Too many requests. Please try again later.",
});

app.use("/api/jobs", jobRoutes());
app.use("/api/auth", authRateLimiter, authRoutes());
app.use("/api/applications", writeRateLimiter, applicationRoutes());
app.use("/api/employer/jobs", employerJobRoutes());
app.use("/api/employer/applications", employerApplicationRoutes());
app.use("/api/admin", adminRoutes());
app.use("/api/saved-jobs", savedJobRoutes());

app.get("/api/health", async (_req, res) => {
  await pool.query("SELECT 1");
  res.json({
    success: true,
    message: "Job portal API is running",
  });
});

app.use("/api", (_req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

if (fs.existsSync(frontendDirectory)) {
  app.use(express.static(frontendDirectory, { index: false, maxAge: "1h" }));
  app.get("/{*path}", (_req, res) => res.sendFile(path.join(frontendDirectory, "index.html")));
}

app.use(errorHandler);

async function startServer() {
  try {
    await pool.query("SELECT 1");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(
      `Unable to connect to PostgreSQL. Check DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_NAME. (${error.code || error.message})`,
    );
    process.exit(1);
  }
}

startServer();
