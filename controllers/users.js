const userModel = require("../model/user");
module.exports.register = async (req, res, next) => {
  res.render("user/register.ejs");
};

module.exports.postRegister = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const user = new userModel({ username: username, email: email });
    const newUser = await userModel.register(user, password);
    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "successfully created the account");
      res.redirect("/camp_ground");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.login = async (req, res, next) => {
  res.render("user/login.ejs");
};
module.exports.postLogin = async (req, res, next) => {
  req.flash("success", "welcome back");
  const returnUrl = req.session.ReturnTo || "/camp_ground";
  delete req.session.ReturnTo;
  res.redirect(returnUrl);
};
module.exports.logout = (req, res, next) => {
  req.logOut();
  req.flash("success", "successfully logout");
  res.redirect("/camp_ground");
};
