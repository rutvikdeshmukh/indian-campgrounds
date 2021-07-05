const { number, string } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const reviewSchema = new Schema({
  rating: Number,
  body: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
const reviewModel = mongoose.model("Review", reviewSchema);
module.exports.reviewModel = reviewModel;
