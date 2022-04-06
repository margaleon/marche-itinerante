const jwt = require("jsonwebtoken");

const generateToken = async (user) => {
  return jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET);
};

const authenticateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken)
    return res.status(400).json({ error: "User not authenticated" });

  try {
    const validToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

module.exports = { generateToken, authenticateToken };
