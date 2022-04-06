const express = require("express");
const blogController = require("../controllers/blogController");
const { authenticateToken } = require("../utils/JWT");

const router = express.Router();

router.get("/", authenticateToken, blogController.post_edit_page);
router.get("/:id", authenticateToken, blogController.post_edit_byID);

module.exports = router;
