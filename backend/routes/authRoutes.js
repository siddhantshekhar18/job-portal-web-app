const express = require("express");
const authenticate = require("../middleware/authenticate");
const {
  validateRegister,
  validateLogin,
} = require("../middleware/authValidation");
const { register, login, me } = require("../controllers/authController");

const router = express.Router();

module.exports = () => {
  router.post("/register", validateRegister, register);
  router.post("/login", validateLogin, login);
  router.get("/me", authenticate, me);

  return router;
};
