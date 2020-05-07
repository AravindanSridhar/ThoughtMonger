//Includes
const express = require("express");
const path = require("path");
const chalk = require("chalk");
const morgan = require("morgan");
const debug = require("debug")("server");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

debug(chalk.redBright("===> Starting server in debug mode."));

//Server Initialization
var server = express();

require("./src/config/passportConfig")(passport);

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
server.use(
  session({
    secret: "HighSecurityShit",
    resave: true,
    saveUninitialized: true,
  })
);

//Passport.js Middleware
server.use(passport.initialize());
server.use(passport.session());

//Flash Configuration
server.use(flash());
server.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.login_success_msg = req.flash("login_success_msg");
  res.locals.login_error_msg = req.flash("login_error_msg");
  res.locals.error = req.flash("error");
  next();
});

//====Routing=====
const publicRouter = require("./src/routes/public");
const userRouter = require("./src/routes/users");

server.use("/users", userRouter);
server.use("/", publicRouter);

server.get("/sessions", (req, res) => {
  req.sessionStore.sessionModel
    .findAll()
    .then((sessions) =>
      sessions.map((sess) => JSON.parse(sess.dataValues.data))
    )
    .then((sessions) => {
      debug(sessions);
      res.send(sessions);
    });
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
