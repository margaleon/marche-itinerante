const { Post } = require("../models/postModel");
const { Participant } = require("../models/participantModel");
const cloudinary = require("../utils/cloudinary");

/* GET EDIT PAGE --CREATE */
const post_edit_page = async (req, res) => {
  const posts = await Post.find();
  const numPosts = posts.length;

  const data = {
    title: "Title",
    author: "Author",
    content: "Écrivez le contenu de votre article ici.",
  };
  res.render("new", { postData: data, numPosts: numPosts });
};

/* GET EDIT PAGE --UPDATE BY ID */
const post_edit_byID = async (req, res) => {
  const id = req.params.id;
  const post = await Post.findById(id);
  const data = {
    title: post.title,
    author: post.author,
    date: post.date,
    content: post.content,
  };
  res.render("edit", { postID: id, postData: data });
};

/* UPLOAD IMAGE */
const image_upload = async (req, res) => {
  let postId = req.params.id;
  let postIndex = Number(req.query.postindex) + 1;
  let folderName = `post_${postIndex}`;
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: folderName,
    });
    const urlParts = result.secure_url.split("upload");
    const completeUrl = `${urlParts[0]}upload/q_auto,f_auto,w_600,c_scale${urlParts[1]}`;
    const image = {
      imageUrl: completeUrl,
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
};

const audio_upload = async (req, res) => {
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
};

const image_delete = async (req, res) => {
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
};

module.exports = {
  post_edit_page,
  post_edit_byID,
  image_upload,
  image_delete,
  audio_upload,
};
