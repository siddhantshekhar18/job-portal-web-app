function validateJobId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid job ID, it should must be a positive integer",
    });
  }

  next();
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function isStringArray(value, fieldName) {
  if (!Array.isArray(value)) {
    return `${fieldName} must be an array of strings`;
  }

  for (let i = 0; i < value.length; i++) {
    if (typeof value[i] !== "string" || value[i].trim() === "") {
      return `${fieldName} items must be non-empty strings`;
    }
  }

  return null;
}

function validateJob(req, res, next) {
  if (
    !req.body.title ||
    !req.body.company ||
    !req.body.location ||
    !req.body.salary
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (typeof req.body.salary !== "number") {
    return res.status(400).json({
      success: false,
      message: "Salary must be a number",
    });
  }

  if (req.body.salary <= 0) {
    return res.status(400).json({
      success: false,
      message: "Salary must be greater than 0",
    });
  }

  if (
    typeof req.body.title !== "string" ||
    typeof req.body.company !== "string" ||
    typeof req.body.location !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Title, company and location must be strings",
    });
  }

  if (
    req.body.title.trim() === "" ||
    req.body.company.trim() === "" ||
    req.body.location.trim() === ""
  ) {
    return res.status(400).json({
      success: false,
      message: "Title, company or location cannot be empty",
    });
  }

  if (
    req.body.title.trim().length < 3 ||
    req.body.company.trim().length < 3 ||
    req.body.location.trim().length < 3
  ) {
    return res.status(400).json({
      success: false,
      message: "Title, company or location must be a minimum of 3 characters",
    });
  }

  const optionalStringFields = {
    description: "Description",
    employment_type: "Employment type",
    experience_level: "Experience level",
  };

  for (const [field, label] of Object.entries(optionalStringFields)) {
    if (req.body[field] !== undefined && !isNonEmptyString(req.body[field])) {
      return res.status(400).json({
        success: false,
        message: `${label} must be a non-empty string`,
      });
    }
  }

  const optionalArrayFields = {
    requirements: "Requirements",
    responsibilities: "Responsibilities",
    skills: "Skills",
  };

  for (const [field, label] of Object.entries(optionalArrayFields)) {
    if (req.body[field] !== undefined) {
      const arrayError = isStringArray(req.body[field], label);

      if (arrayError) {
        return res.status(400).json({
          success: false,
          message: arrayError,
        });
      }
    }
  }

  next();
}

module.exports = {
  validateJobId,
  validateJob,
};
