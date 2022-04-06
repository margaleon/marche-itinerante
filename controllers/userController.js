const bcrypt = require("bcrypt");
const { User } = require("../models/userModel");

/* GET ALL USERS */
const user_get_all = (req, res) => {
  User.find()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

/* GET USER BY ID */
const user_get_byID = (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

/* CREATE USER */
const user_create = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    throw new Error("Email already exist");
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    res.status(200).json({ user: savedUser });
  } catch (err) {
    res.status(500).json(err);
  }
};

/* UPDATE USER BY ID */
const user_update = (req, res) => {
  const id = req.params.id;
  User.findByIdAndUpdate(id)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

module.exports = {
  user_get_all,
  user_get_byID,
  user_create,
  user_update,
};
