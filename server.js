//Includes
const express = require("express");
const mysql = require("mysql");
const path = require("path");
const crypto = require("crypto");
const chalk = require("chalk");
const morgan = require("morgan");
const debug = require("debug")("server");
const bodyParser = require("body-parser");

debug(chalk.redBright("===> Starting server in debug mode."));

//DB connection config file
var dbCredentials = require("./src/dbCredentials.json");

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
//DB Connection
var con = mysql.createConnection(dbCredentials);
// //Session Config
// server.use(session({ secret: "testing" }));
//Morgan logger
server.use(morgan("tiny"));

//MySQL Connect
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL DB!");
});
function (err) {
  if (err) throw err;
  con.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
//Connection Reset Handler
setInterval(function () {
  con.query("SELECT 1");
}, 10000);

//Routing
const loginRouter = require("./src/routes/login");

server.use("/login", loginRouter);

server.get("/", function (req, res) {
  res.render("landing", {});
});

server.listen(server.get("port"), function () {
  console.log(
    "ThoughtMonger Server started at : " +
      Date() +
      " at port : " +
      chalk.greenBright(server.get("port"))
  );
});
