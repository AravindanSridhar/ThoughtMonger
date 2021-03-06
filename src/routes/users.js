const express = require("express");
const userRouter = express.Router();
const db = require("../config/dbConnection");
const debug = require("debug")("server");
const chalk = require("chalk");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const { ensureAuthenticated } = require("../config/auth");

//Body Parser
userRouter.use(bodyParser.urlencoded({ extended: false }));
userRouter.use(bodyParser.json());

userRouter.get("/timeline", ensureAuthenticated, (req, res) => {
  var user_email = req.user.user_email;
});

module.exports = userRouter;
