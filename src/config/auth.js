module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("login_error_msg", "You need to be logged in for that.");
    res.redirect("/");
  },
};
