const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const db = require("./dbConnection");
const debug = require("debug")("server");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        //Find user
        const findUser = "SELECT * FROM users WHERE user_email = ?";
        var userRes = await db.query(findUser, [email]);
        var user = {};
        user.user_email = userRes[0].user_email;
        user.user_password = userRes[0].user_password;

        //No such user
        if (user == undefined) {
          return done(null, false, {
            message: "Uh oh! Looks like you are not a monger yet.",
          });
        }
        var passwordHash = crypto
          .createHash("sha256")
          .update(password)
          .digest("hex");

        //Password Check
        if (passwordHash == user.user_password) {
          //Correct password
          // debug(user);
          return done(null, user);
        } else {
          //Incorrect password
          return done(null, false, { message: "Incorrect credentials!" });
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.user_email);
  });

  passport.deserializeUser(async (user_email, done) => {
    var userRes = await db.query("SELECT * FROM users WHERE user_email = ?", [
      user_email,
    ]);
    var err = {};
    var user = {};
    debug("Good here");
    user.user_email = userRes[0].user_email;
    user.user_password = userRes[0].user_password;
    done(null, user);
  });
};
