const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  formattedDate: { type: String },
  content: { type: String, required: true },
  author: { type: String, required: true },
  images: [
    {
      imageUrl: { type: String },
      publicId: { type: String },
    },
  ],
});

const Post = mongoose.model("Post", postSchema);

module.exports = { Post };
