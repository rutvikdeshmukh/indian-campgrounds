const authentication = function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.ReturnTo = req.originalUrl;
    req.flash("error", "you must be login");
    return res.redirect("/login");
  }
  next();
};
module.exports.authentication = authentication;
