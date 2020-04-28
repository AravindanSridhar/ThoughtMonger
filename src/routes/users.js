const express = require("express");
const userRouter = express.Router();
const db = require("./dbConnection");
const debug = require("debug")("server");
const chalk = require("chalk");
const bodyParser = require("body-parser");
const crypto = require("crypto");

//Body Parser
userRouter.use(bodyParser.urlencoded({ extended: false }));
userRouter.use(bodyParser.json());

module.exports = userRouter;
