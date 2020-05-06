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
        var user = await db.query(findUser, [email]);
        user = user[0];
        if (user == undefined) {
          return done(null, false, {
            message: "Uh oh! Looks like you are not a monger yet.",
          });
        }
        var passwordHash = crypto
          .createHash("sha256")
          .update(password)
          .digest("hex");
        if (passwordHash == user.user_password) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect credentials!" });
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.user_email);
  });

  passport.deserializeUser(async (user_email, done) => {
    var user = await db.query("SELECT * FROM users WHERE user_email = ?", [
      user_email,
    ]);
    done(user[0]);
  });
};
