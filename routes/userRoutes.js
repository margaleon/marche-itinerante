const express = require("express");
const userController = require("../controllers/userController");
const { authenticateToken } = require("../utils/JWT");

const router = express.Router();

router.get("/", authenticateToken, userController.user_get_all);
router.post("/", authenticateToken, userController.user_create);
router.get("/:id", authenticateToken, userController.user_get_byID);
router.patch("/:id", authenticateToken, userController.user_update);

module.exports = router;
