require("dotenv").config();

const jwt = require("jsonwebtoken");

function genrateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}

module.exports = genrateAccessToken;
