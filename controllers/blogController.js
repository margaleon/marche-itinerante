const mv = require("mv");
const fs = require("fs");
const { Post } = require("../models/postModel");

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

const tempDir = "./views/static/temp/";

/* UPLOAD AUDIO REVIEW */
const audio_upload = async (req, res) => {
  let participantIndex = Number(req.query.participantindex) + 1;
  const temp = fs.readdirSync(tempDir);
  temp.forEach((file) => {
    let audioDir = `./views/static/uploads/participant_${participantIndex}/`;

    mv(tempDir + file, audioDir + file, function (err) {
      if (err) {
        console.log(err);
        res.render("error", { message: "Une erreur est survenue..." });
      }
    });
  });

  res.redirect("/");
};

/* UPLOAD IMAGES */
const images_upload = async (req, res) => {
  let postIndex = Number(req.query.postindex) + 1;
  const temp = fs.readdirSync(tempDir);
  temp.forEach((file) => {
    let imgDir = `./views/static/uploads/posts/post_${postIndex}/`;

    mv(tempDir + file, imgDir + file, function (err) {
      if (err) {
        console.log(err);
        res.render("error", { message: "Une erreur est survenue..." });
      }
    });
  });

  res.redirect("/");
};

/* DELETE ONE IMAGE */
const delete_image = async (req, res) => {
  const postIndex = Number(req.query.postindex) + 1;
  const selectedImage = req.query.slide;
  let imageDir =
    __dirname +
    `../views/static/uploads/posts/post_${postIndex}/${selectedImage}`;
  try {
    fs.unlinkSync(imageDir);
    console.log(imageDir);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.render("error", { message: "Une erreur est survenue..." });
  }
};

module.exports = {
  post_edit_page,
  post_edit_byID,
  audio_upload,
  images_upload,
  delete_image,
};
