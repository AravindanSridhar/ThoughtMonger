const mysql = require("mysql");
const util = require("util");
const chalk = require("chalk");
var dbCredentials = require("../dbCredentials.json");
const debug = require("debug")("server");

//Connection Variable
var db;

function connectDatabase() {
  if (!db) {
    db = mysql.createConnection(dbCredentials);
    return {
      query(sql, args) {
        return util.promisify(db.query).call(db, sql, args);
      },
      close() {
        return util.promisify(db.end).call(db);
      },
    };
  }
  return db;
}

module.exports = connectDatabase();
