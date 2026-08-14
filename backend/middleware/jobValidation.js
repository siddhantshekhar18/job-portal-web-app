function validateJobId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid job ID, it should must be a positive integer",
    });
  }
  next();
}
function validateJob(req, res, next) {
  if (
    !req.body.title ||
    !req.body.company ||
    !req.body.location ||
    !req.body.salary
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (typeof req.body.salary !== "number") {
    return res.status(400).json({
      message: "Salary must be a number",
    });
  }

  if (req.body.salary <= 0) {
    return res.status(400).json({
      message: "Salary must be greater than 0",
    });
  }

  if (
    typeof req.body.title !== "string" ||
    typeof req.body.company !== "string" ||
    typeof req.body.location !== "string"
  ) {
    return res.status(400).json({
      message: "Title, company and location must be strings",
    });
  }

  if (
    req.body.title.trim() === "" ||
    req.body.company.trim() === "" ||
    req.body.location.trim() === ""
  ) {
    return res.status(400).json({
      message: "Title, company or location cannot be empty",
    });
  }

  if (
    req.body.title.trim().length < 3 ||
    req.body.company.trim().length < 3 ||
    req.body.location.trim().length < 3
  ) {
    return res.status(400).json({
      message: "Title, company or location must be a minimum of 3 characters",
    });
  }

  next();
}
module.exports = {
  validateJobId,
  validateJob,
};
