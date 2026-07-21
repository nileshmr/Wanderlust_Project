const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require("multer");
const {storage} = require("../cloudConfig.js"); 
const upload = multer({ storage }); 



router.route("/")  //router.route() ek method hota hai jo similar route ka kaam ki jagah krta hai, hum aise likh skte hai code thoda thoda aur chhota krne keliye..combine krne keliye use hota hai jo same path route hoga.
.get( wrapAsync(listingController.index))
.post( isLoggedIn,  upload.single('listing[image]'),validateListing, wrapAsync(listingController.CreateListing)
);


//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
.route("/:id")
.get( wrapAsync(listingController.showListing))
.put( isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
.delete( isLoggedIn, wrapAsync(listingController.destroyListing)
);




// //index Route
// router.get("/", wrapAsync(listingController.index));

//New Route
// router.get("/new", isLoggedIn, listingController.renderNewForm); // isko asiehi upar rkh diye.., kyuki niche kaam nhi krenge pahle ke according

//Show Route
// router.get("/:id", wrapAsync(listingController.showListing));

//Create Route
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.CreateListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//Update Route
// router.put("/:id", isLoggedIn, validateListing, wrapAsync(listingController.updateListing));

//Delete Route
// router.delete("/:id", isLoggedIn, wrapAsync(listingController.destroyListing));

module.exports = router;