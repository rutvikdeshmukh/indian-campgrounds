const ExpressError = require("../util/ExpressError");
const wrapAsync = (fn) => {
  return async function (req, res, next) {
    try {
      fn(req, res, next);
    } catch (e) {
      return next(new ExpressError(e.message));
    }
  };
};

module.exports = wrapAsync;
