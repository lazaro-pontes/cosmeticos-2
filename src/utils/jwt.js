const jwt = require("jsonwebtoken");

const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, { expiresIn: "1h", algorithm: "HS256" });
};

module.exports = { generateToken };