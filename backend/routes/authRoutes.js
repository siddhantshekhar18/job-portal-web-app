const express = require("express");
const authenticate = require("../middleware/authenticate");
const {
  validateRegister,
  validateLogin,
} = require("../middleware/authValidation");
const {
  register,
  registerEmployer,
  login,
  me,
} = require("../controllers/authController");

const router = express.Router();

module.exports = () => {
  router.post("/register", validateRegister, register);
  router.post("/register/employer", validateRegister, registerEmployer);
  router.post("/login", validateLogin, login);
  router.get("/me", authenticate, me);

  return router;
};
