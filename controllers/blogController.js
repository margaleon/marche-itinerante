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

module.exports = {
  post_edit_page,
  post_edit_byID,
};
