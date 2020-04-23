const express = require("express");
const loginRouter = express.Router();
const debug = require("debug")("server");
const chalk = require("chalk");
const bodyParser = require("body-parser");

//Body Parser
loginRouter.use(bodyParser.urlencoded({ extended: false }));
loginRouter.use(bodyParser.json());

loginRouter.post("/", function (req, res) {
  var userName = req.body.userName;
  var password = req.body.password;
  var ip = req.ip;
  var loginTimestamp = new Date();
  res.send("Login Response");
  (async function query() {
    const passwordHash = await con.query("SELECT * FROM users");
    console.log("passwordHash");
  });
});

module.exports = loginRouter;
