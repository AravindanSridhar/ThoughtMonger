const express = require("express");
const publicRouter = express.Router();
const db = require("./dbConnection");
const debug = require("debug")("server");
const chalk = require("chalk");
const bodyParser = require("body-parser");
const crypto = require("crypto");

//Body Parser
publicRouter.use(bodyParser.urlencoded({ extended: false }));
publicRouter.use(bodyParser.json());

publicRouter.post("/login", function (req, res) {
  var userName = req.body.userName;
  var password = req.body.password;
  var ip = req.ip;
  var loginTimestamp = new Date();
  var selectUser = "SELECT user_password FROM users WHERE user_name = ?";
  db.query(selectUser, [userName], (err, result) => {
    res.send(result);
  });
});

module.exports = publicRouter;
