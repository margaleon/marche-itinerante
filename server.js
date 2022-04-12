require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { Participant } = require("./models/participantModel");
const { Post } = require("./models/postModel");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const editorRoutes = require("./routes/editorRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

const { PORT } = process.env;
const port = process.env.PORT || PORT;
const { MONGO_URI } = process.env;

app.use(express.static(__dirname + "/views/"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

/* connect to db */
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(function () {
    console.log("Database is connected");
  })
  .catch((err) => console.log(err));

/* home */
app.get("/", async (req, res) => {
  try {
    const getParticipants = async function () {
      const participants = await Participant.find({});
      return participants;
    };

    const accessToken = req.cookies["access-token"];

    Post.find({}, async (err, posts) => {
      numPosts = posts.length;
      posts.forEach(async (post, index) => {
        const dateOptions = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        };
        const formattedDate = post.date.toLocaleDateString(
          "fr-FR",
          dateOptions
        );
        post.formattedDate = formattedDate;
      });

      const participants = await getParticipants();
      res.render("index", { posts, participants, numPosts, accessToken });
    });
  } catch (err) {
    console.log(err);
    res.status(500).render("error", {
      message: "Le chargement du contenu a échoué. Veuillez réessayer.",
    });
  }
});

/* logout */
app.get("/logout", (req, res) => {
  res.clearCookie("access-token").redirect("/");
});

/* reset password */
app.post("/reset-password/:userId/:token", (req, res) => {
  res.render("resetPassword");
});

app.use("/posts", postRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/edit", editorRoutes);
app.use("/upload", uploadRoutes);

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
