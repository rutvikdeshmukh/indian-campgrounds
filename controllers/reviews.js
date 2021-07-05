const { Camp_ground_model } = require("../model/campground");
const { reviewModel } = require("../model/reviews");
module.exports.postReview = async (req, res, next) => {
  const campGround = await Camp_ground_model.findById(req.params.id);
  const review = new reviewModel(req.body.review);
  review.author = req.user;
  campGround.reviews.push(review);
  await review.save();
  await campGround.save();
  req.flash("success", "successfully added review");
  res.redirect(`/camp_ground/${req.params.id}`);
};

module.exports.deleteReview = async (req, res, next) => {
  const { id, review_id } = req.params;
  await reviewModel.findByIdAndDelete(review_id);
  await Camp_ground_model.findByIdAndUpdate(id, {
    $pull: { reviews: review_id },
  });
  res.redirect(`/camp_ground/${id}`);
};
