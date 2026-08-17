const express = require("express");
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
