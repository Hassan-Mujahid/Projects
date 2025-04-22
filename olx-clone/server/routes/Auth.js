const userAuthRoutes = require("express").Router();

const UserAuthContorller = require("../controllers/Auth");

const userAuthContorller = new UserAuthContorller();

userAuthRoutes.post("/create-account", userAuthContorller.createUser);
userAuthRoutes.post("/login", userAuthContorller.loginUser);

module.exports = userAuthRoutes;
