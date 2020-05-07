const express = require("express");
const publicRouter = express.Router();
const db = require("../config/dbConnection");
const debug = require("debug")("server");
const chalk = require("chalk");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const passport = require("passport");

//Body Parser
publicRouter.use(bodyParser.urlencoded({ extended: false }));
publicRouter.use(bodyParser.json());

publicRouter.get("/", function (req, res) {
  res.render("landing", {});
});

publicRouter.get("/signup", (req, res) => {
  var signUpErrors = {};
  res.render("signup", { signUpErrors });
});

publicRouter.get("/sqlTest", async (req, res) => {
  var result = await db.query("Select * from users;");
  console.log(result);
});

publicRouter.post("/signup", async (req, res) => {
  debug(req.body);
  var userName = req.body.userName;
  var password = req.body.password;
  var password2 = req.body.password2;
  var email = req.body.email;
  var ip = req.ip;
  var loginTimestamp = new Date();
  var signUpErrors = [];
  var selectUser = "SELECT user_name FROM users WHERE  user_email = ?";
  var existingUsers = await db.query(selectUser, [email]);

  if (existingUsers.length == 0) {
    if (userName == "") {
      signUpErrors.userNameError = "is-invalid";
    }
    if (email == "") {
      signUpErrors.emailError = "is-invalid";
    }
    if (password == "") {
      signUpErrors.passwordError = "is-invalid";
    }
    if (password != password2) {
      signUpErrors.password2Error = "is-invalid";
    }
    if (Object.keys(signUpErrors).length > 0) {
      res.render("signup", { signUpErrors });
    } else {
      var createUser =
        "INSERT INTO users(user_name,user_email,user_password) VALUES (?,?,?)";
      var passwordHash = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");
      try {
        var createUserResult = await db.query(createUser, [
          userName,
          email,
          passwordHash,
        ]);
        req.flash("login_success_msg", "You are a monger now! You may login.");
        res.redirect("/");
      } catch (err) {
        debug(err);
        signUpErrors.accountError = "Sorry! Internal error.";
        res.render("signup", { signUpErrors });
      }
    }
  } else {
    signUpErrors.accountError = "Account already exists!";
    res.render("signup", { signUpErrors });
  }
});

publicRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/users/timeline",
    failureRedirect: "/",
    failureFlash: true,
  })(req, res, next);
});

module.exports = publicRouter;
