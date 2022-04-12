const express = require("express");
const { authenticateToken } = require("../utils/JWT");
const upload = require("../utils/multer");
const blogController = require("../controllers/blogController");

const router = express.Router();

router.post(
  "/audio/:id",
  authenticateToken,
  upload.single("audio"),
  blogController.audio_upload
);

router.post(
  "/images/:id",
  authenticateToken,
  upload.single("image"),
  blogController.image_upload
);

router.delete("/images/:id", authenticateToken, blogController.image_delete);

module.exports = router;
