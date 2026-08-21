function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
}

function isPositiveInteger(value) {
  const number = Number(value);

  return Number.isInteger(number) && number > 0;
}

function validateApplication(req, res, next) {
  const { job_id, full_name, email, phone, cover_letter } = req.body;

  if (!isPositiveInteger(job_id)) {
    return res.status(400).json({
      success: false,
      message: "Job ID must be a positive integer",
    });
  }

  if (!isNonEmptyString(full_name)) {
    return res.status(400).json({
      success: false,
      message: "Full name is required",
    });
  }

  if (!isNonEmptyString(email)) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address",
    });
  }

  if (!isNonEmptyString(phone)) {
    return res.status(400).json({
      success: false,
      message: "Phone number is required",
    });
  }

  if (cover_letter !== undefined && typeof cover_letter !== "string") {
    return res.status(400).json({
      success: false,
      message: "Cover letter must be a string",
    });
  }

  next();
}

module.exports = {
  validateApplication,
};
