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

publicRouter.get("/", function (req, res) {
  res.render("landing", {});
});

publicRouter.get("/signup", (req, res) => {
  res.render("signup", {});
});

publicRouter.post("/signup", function (req, res) {
  var userName = req.body.userName;
  var password = req.body.password;
  var password2 = req.body.password2;
  var email = req.body.email;
  var ip = req.ip;
  var loginTimestamp = new Date();
  var signUpErrors = [];
  var selectUser = "SELECT user_name FROM users WHERE  user_email = ?";
  db.query(selectUser, [email], (err, result) => {
    if (result.length == 0) {
      if (password != password2) {
        signUpErrors.push({ msg: "Passwords don't match." });
        res.render("signup", { signUpErrors });
      } else {
        req.flash("success_msg", "Signed up! You may sign in, monger.");
        res.redirect("/");
      }
    } else {
      signUpErrors.push({ msg: "Account already exists!" });
      debug(signUpErrors);
      res.render("signup", { signUpErrors });
    }
  });
});

module.exports = publicRouter;
