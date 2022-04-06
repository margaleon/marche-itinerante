const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/login", authController.get_login_page);
router.post("/login", authController.login);
router.get("/reset-password", authController.get_password_reset_page);
router.post("/reset-password", authController.password_reset);

module.exports = router;
