const express = require("express");
const passport = require("passport");
const router = express.Router();
const wrapAsync = require("../util/catchingError");
const users = require("../controllers/users");
router
  .route("/register")
  .get(wrapAsync(users.register))
  .post(wrapAsync(users.postRegister));
router
  .route("/login")
  .get(wrapAsync(users.login))
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    wrapAsync(users.postLogin)
  );
router.get("/logout", wrapAsync(users.logout));
module.exports = router;
