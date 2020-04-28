const mysql = require("mysql");
const chalk = require("chalk");
var dbCredentials = require("../dbCredentials.json");
const debug = require("debug")("server");

//Connection Variable
var db;

function connectDatabase() {
  if (!db) {
    db = mysql.createConnection(dbCredentials);
    db.connect(function (err) {
      if (!err) {
        debug(chalk.greenBright("Database is connected!"));
      } else {
        debug(chalk.redBright("Error connecting database!"));
      }
    });
  }
  return db;
}

module.exports = connectDatabase();
