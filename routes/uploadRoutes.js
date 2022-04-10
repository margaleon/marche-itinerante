const express = require("express");
const path = require("path");
const cloudinary = require("../utils/cloudinary");
const multer = require("multer");
const blogController = require("../controllers/blogController");
const { authenticateToken } = require("../utils/JWT");
const upload = require("../utils/multer");
const { Post } = require("../models/postModel");

// const tempDir = "./views/static/temp/";
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, tempDir);
//   },
//   filename: function (req, file, cb) {
//     if (file.fieldname === "audio") {
//       cb(
//         null,
//         req.query.participantname + "_review" + path.extname(file.originalname)
//       );
//     } else {
//       cb(null, Date.now() + path.extname(file.originalname));
//     }
//   },
// });

const router = express.Router();

// router.post(
//   "/audio/:id",
//   authenticateToken,
//   upload.single("audio"),
//   blogController.audio_upload
// );
// router.post(
//   "/images/:id",
//   authenticateToken,
//   upload.array("images", 12),
//   blogController.images_upload
// );
// router.delete("/images/:id", authenticateToken, blogController.delete_image);

router.post(
  "/images/:id",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    let postId = req.params.id;
    let postIndex = Number(req.query.postindex) + 1;
    let folderName = `post_${postIndex}`;
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: folderName,
      });
      const image = {
        imageUrl: result.secure_url,
        publicId: result.public_id,
      };
      await Post.findByIdAndUpdate(
        { _id: postId },
        { $addToSet: { images: image } }
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  }
);

router.delete("/images/:id", authenticateToken, async (req, res) => {
  try {
    let postId = req.params.id;
    let postIndex = Number(req.query.postindex) + 1;
    let selectedImage = req.query.image;

    const publicId = selectedImage.publicId;

    await cloudinary.uploader.destroy({ public_id: publicId }, (err, res) => {
      console.log(err, res);
    });

    await Post.findByIdAndUpdate(
      { _id: postId },
      { $pull: { images: { public_id: publicId } } }
    );
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
