const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
const { validateRegister, validateLogin } = require("../middleware/validate");

// @route   POST api/auth/register
router.post("/register", validateRegister, authController.register);

// @route   POST api/auth/login
router.post("/login", validateLogin, authController.login);

// @route   GET api/auth/me
router.get("/me", auth, authController.getMe);

module.exports = router;
