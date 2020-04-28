//Includes
const express = require("express");
const mysql = require("mysql");
const path = require("path");
const crypto = require("crypto");
const chalk = require("chalk");
const morgan = require("morgan");
const debug = require("debug")("server");
const bodyParser = require("body-parser");
const session = require("express-session");
const falsh = require("connect-flash");
const db = require("./src/routes/dbConnection.js");

debug(chalk.redBright("===> Starting server in debug mode."));
//Server Initialization
var server = express();

//Server Port specification
server.set("port", process.env.PORT || 5000);

//==Middlewares==
//Body Parser
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
//Static Files
server.use(express.static(path.join(__dirname, "/src/public")));
//EJS View engine
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "/src/views"));

//Morgan logger
server.use(morgan("tiny"));

//Session configuration
app.use(
  session({
    secret: "HighSecurityShit",
    resave: true,
    saveUninitialized: true,
  })
);

//Flash Configuration
server.use(flash());
server.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
});

//Routing
const publicRouter = require("./src/routes/public");
const userRouter = require("./src/routes/users");

server.use("/users", userRouter);
server.use("/", publicRouter);

server.get("/", function (req, res) {
  res.render("landing", {});
});

//Server Listen
server.listen(server.get("port"), function () {
  console.log(
    "ThoughtMonger Server started at : " +
      Date() +
      " at port : " +
      chalk.greenBright(server.get("port"))
  );
});
