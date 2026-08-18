const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const app = express();

const jobRoutes = require("./routes/jobRoutes");

const PORT = 3000;

app.use(express.json());

app.use("/api/jobs", jobRoutes());

app.get("/", (req, res) => {
  res.json({
    message: "Job portal API is running",
  });
});
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
