const express = require("express");
const userController = require("../controllers/user.js");

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
    res.send('This Works!')
})

userRouter.post("/login", userController.login);
userRouter.post("/signup", userController.signup);

module.export = userRouter;