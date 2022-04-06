const express = require("express");
const path = require("path");
const multer = require("multer");
const blogController = require("../controllers/blogController");
const { authenticateToken } = require("../utils/JWT");

const tempDir = "./views/static/temp/";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    if (file.fieldname === "audio") {
      cb(
        null,
        req.query.participantname + "_review" + path.extname(file.originalname)
      );
    } else {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  },
});
const upload = multer({ storage: storage });

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
  upload.array("images", 12),
  blogController.images_upload
);
router.delete("/images/:id", authenticateToken, blogController.delete_image);

module.exports = router;
