const mongoose = require("mongoose");
const schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };
const imageSchema = new schema({
  path: String,
  filename: String,
});
imageSchema.virtual("thumbnail").get(function () {
  return this.path.replace("/upload", "/upload/w_300");
});
const campgroundSchema = new schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    price: { type: Number, required: [true, "price is required"], min: 0 },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    location: {
      type: String,
      required: [true, "location is required"],
    },
    geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    images: [imageSchema],
    author: {
      type: schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

campgroundSchema.virtual("properties.popupText").get(function () {
  return `<strong> <a href="/camp_ground/${this._id}"> ${this.title} </a> </strong>
   <p> ${this.description}</p>`;
});

const { reviewModel } = require("./reviews");
campgroundSchema.post("findOneAndDelete", async (data) => {
  if (data.reviews.length) {
    reviewModel.deleteMany({ _id: { $in: data.reviews } });
  }
});

const Camp_ground_model = new mongoose.model("Camp_ground", campgroundSchema);
module.exports.Camp_ground_model = Camp_ground_model;
