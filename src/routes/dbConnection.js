const mysql = require("mysql");
const chalk = require("chalk");
var dbCredentials = require("../dbCredentials.json");
const debug = require("debug")("server");

//Connection Variable
var db;

function connectDatabase() {
  if (!db) {
    db = mysql.createPool(dbCredentials);
  }
  return db;
}

module.exports = connectDatabase();
