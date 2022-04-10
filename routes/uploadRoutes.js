const express = require("express");
const cloudinary = require("../utils/cloudinary");
const { authenticateToken } = require("../utils/JWT");
const upload = require("../utils/multer");
const { Post } = require("../models/postModel");
const { Participant } = require("../models/participantModel");

const router = express.Router();

router.post(
  "/audio/:id",
  authenticateToken,
  upload.single("audio"),
  async (req, res) => {
    let participantId = req.params.id;
    let participantIndex = Number(req.query.participantindex) + 1;
    let folderName = `participant_${participantIndex}`;
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "video",
        folder: folderName,
      });

      const audio = {
        audioUrl: result.secure_url,
        publicId: result.public_id,
      };
      console.log(participantId);
      await Participant.findByIdAndUpdate(
        { _id: participantId },
        { $set: { review: audio } }
      );

      res.redirect("/");
    } catch (err) {
      console.log(err);
      res.render("error", {
        message: "L'upload a échoué. Veuillez réessayer.",
      });
    }
  }
);

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
      res.render("error", {
        message: "L'upload a échoué. Veuillez réessayer.",
      });
    }
  }
);

router.delete("/images/:id", authenticateToken, async (req, res) => {
  try {
    let postId = req.params.id;
    let imgPublicId = req.query.imagePublicId;

    await cloudinary.uploader.destroy(imgPublicId, (err, res) => {
      console.log(err, res);
    });

    await Post.findByIdAndUpdate(
      { _id: postId },
      { $pull: { images: { publicId: imgPublicId } } }
    );

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.render("error", { message: "La suppression a échoué." });
  }
});

module.exports = router;
