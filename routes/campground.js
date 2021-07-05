const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/catchingError");
const { authentication } = require("../middleware");
const camp_ground = require("../controllers/campground");
var multer = require("multer");
const { storage } = require("../cloudinary");
var upload = multer({ storage });

router.get("/", wrapAsync(camp_ground.index));
router.get("/new", wrapAsync(camp_ground.new_camp_ground));
router
  .route("/create")
  .get(wrapAsync(camp_ground.new_camp_ground))
  .post(
    authentication,
    upload.array("images"),
    wrapAsync(camp_ground.create_camp_ground)
  );

router.get("/:id", wrapAsync(camp_ground.show_campground));
router.get("/:id/edit", wrapAsync(camp_ground.edit_camp_ground));

router.patch(
  "/:id/update",
  upload.array("images"),
  wrapAsync(camp_ground.update_camp_ground)
);
router.delete("/:id/delete", wrapAsync(camp_ground.delete_camp_ground));
module.exports = router;
