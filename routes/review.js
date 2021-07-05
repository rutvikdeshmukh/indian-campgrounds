const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../util/catchingError");
const camp_ground = require("../controllers/campground");
const { authentication } = require("../middleware");
const reviews = require("../controllers/reviews");

router
  .route("/")
  .get(wrapAsync(camp_ground.show_campground))
  .post(authentication, wrapAsync(reviews.postReview));
router.delete("/:review_id/delete", wrapAsync(reviews.deleteReview));
module.exports.reviewRouter = router;
