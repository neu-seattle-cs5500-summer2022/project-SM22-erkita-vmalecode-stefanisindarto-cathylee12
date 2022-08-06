const express = require("express");
const userController = require("../controllers/user.js");

const userRouter = express.Router();

userRouter.post("/login", userController.login);
userRouter.post("/signup", userController.signup);

module.exports = userRouter;
