const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const app = express();

const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const employerJobRoutes = require("./routes/employerJobRoutes");
const employerApplicationRoutes = require("./routes/employerApplicationRoutes");
const adminRoutes = require("./routes/adminRoutes");

const PORT = 3000;

app.use(express.json());

app.use("/api/jobs", jobRoutes());
app.use("/api/auth", authRoutes());
app.use("/api/applications", applicationRoutes());
app.use("/api/employer/jobs", employerJobRoutes());
app.use("/api/employer/applications", employerApplicationRoutes());
app.use("/api/admin", adminRoutes());

app.get("/", (req, res) => {
  res.json({
    message: "Job portal API is running",
  });
});
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
