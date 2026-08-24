const express = require("express");
const authenticate = require("../middleware/authenticate");
const authorizeRoles = require("../middleware/authorizeRoles");
const { getStats } = require("../controllers/adminController");

const router = express.Router();

module.exports = () => {
  router.use(authenticate);
  router.use(authorizeRoles("admin"));

  router.get("/stats", getStats);

  return router;
};
