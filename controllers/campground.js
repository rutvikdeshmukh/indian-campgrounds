const { Camp_ground_model } = require("../model/campground");
const { findByIdAndUpdate } = require("../model/user");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const ExpressError = require("../util/ExpressError");
const { cloudinary } = require("../cloudinary");
module.exports.index = async (req, res, next) => {
  const camp_ground_data = await Camp_ground_model.find({});
  res.render("camp_ground/index.ejs", { camp_ground_data });
};

module.exports.show_campground = async (req, res, next) => {
  const find_record = await Camp_ground_model.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");

  if (!find_record) {
    req.flash("error", "can not find the campground");
    return res.redirect("/camp_ground");
  }

  res.render("camp_ground/show.ejs", { find_record });
};
module.exports.new_camp_ground = async (req, res, next) => {
  res.render("camp_ground/new.ejs");
};

module.exports.create_camp_ground = async (req, res, next) => {
  const geodata = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  try {
    if (geodata?.body?.features[0]?.geometry) {
      const insert_record = new Camp_ground_model(req.body.campground);
      insert_record.images = req.files.map((element) => ({
        path: element.path,
        filename: element.filename,
      }));
      insert_record.author = req.user._id;
      insert_record.geometry = geodata.body.features[0].geometry;
      const created_record = await insert_record.save();
      const { _id } = created_record;
      req.flash("success", "successfully created the new account");
      res.redirect(`/camp_ground/${_id}`);
    } else {
      return next(new ExpressError("Enter the valid location"));
    }
  } catch (e) {
    return next(new ExpressError("Enter the valid Price"));
  }
};
module.exports.edit_camp_ground = async (req, res, next) => {
  const { id } = req.params;
  const data_record = await Camp_ground_model.findById(id);
  return res.render("camp_ground/edit_form.ejs", { data_record });
};

module.exports.update_camp_ground = async (req, res, next) => {
  const { id } = req.params;
  const geodata = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  try {
    if (geodata?.body?.features[0]?.geometry) {
      const record = await Camp_ground_model.findByIdAndUpdate(
        id,
        req.body.campground
      );
      record.geometry = geodata.body.features[0].geometry;
      if (req.files.length) {
        const image = req.files.map((element) => ({
          path: element.path,
          filename: element.filename,
        }));
        record.images.push(...image);
      }
      const savedRecord = await record.save();
      if (req.body.deleteImages) {
        if (req.body.deleteImages.length === savedRecord.images.length) {
          return next(
            new ExpressError("Minimum One college image is required")
          );
        }
        for (let filename of req.body.deleteImages) {
          const data = await cloudinary.uploader.destroy(filename);
        }
        await Camp_ground_model.findByIdAndUpdate(
          id,
          {
            $pull: { images: { filename: { $in: req.body.deleteImages } } },
          },
          { new: true }
        );
      }

      req.flash("success", "Information Updated Successfully");
      return res.redirect(`/camp_ground/${id}`);
    } else {
      return next(new ExpressError("enter the valid location"));
    }
  } catch (e) {
    return next(new ExpressError("enter the valid price"));
  }
};
module.exports.delete_camp_ground = async (req, res, next) => {
  const { id } = req.params;
  await Camp_ground_model.findByIdAndDelete(id);
  res.redirect("/camp_ground");
};
