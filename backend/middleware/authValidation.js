function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
}

function validateRegister(req, res, next) {
  const { name, email, password } = req.body;

  if (!isNonEmptyString(name)) {
    return res.status(400).json({
      success: false,
      message: "Name is required and must be a non-empty string",
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
      message: "Please provide a valid email address",
    });
  }

  if (!isNonEmptyString(password)) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long",
    });
  }

  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!isNonEmptyString(email)) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  if (!isNonEmptyString(password)) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  next();
}

module.exports = {
  validateRegister,
  validateLogin,
};
