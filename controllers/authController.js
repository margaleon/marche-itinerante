const bcrypt = require("bcrypt");
const { User } = require("../models/userModel");
const { generateToken } = require("../utils/JWT");

/* GET LOGIN PAGE */
const get_login_page = async (req, res) => {
  res.render("login");
};

/* LOGIN */
const login = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .render("error", { message: "Cet utilisateur n'est pas enregistré." });
  }

  if (await bcrypt.compare(req.body.password, user.password)) {
    const accessToken = await generateToken(user);
    res.cookie("access-token", accessToken, {
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).redirect("/");
  } else {
    res.render("error", { message: "Mot de passe incorrect." });
  }
};

/* GET PASSWORD RESET PAGE */
const get_password_reset_page = async (req, res) => {
  res.render("resetPassword");
};

/* RESET PASSWORD */
const password_reset = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .render("error", { message: "Cet utilisateur n'est pas enregistré." });
  } else {
    if (req.body.password === req.body.passwordConfirm) {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const updatedUser = await User.updateOne(
          { _id: user._id },
          { $set: { password: hashedPassword } },
          { new: true }
        );
        return res.status(200).redirect("/auth/login");
      } catch {}
    } else {
      return res.status(400).render("error", {
        message:
          "La confirmation du mot de passe a échoué. Veuillez réessayer.",
      });
    }
  }
};

module.exports = {
  login,
  get_login_page,
  password_reset,
  get_password_reset_page,
};
