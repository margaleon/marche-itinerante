const jwt = require("jsonwebtoken");

const generateToken = async (user) => {
  return jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET);
};

const authenticateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken)
    return res.status(400).render("error", {
      message:
        "Vous n'avez pas l'autorisation d'accéder à cette page. Veuillez vous connecter.",
    });

  try {
    const validToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .render("error", { message: "Erreur d'authentification." });
  }
};

module.exports = { generateToken, authenticateToken };
