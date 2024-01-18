const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

const listingController = require("../controller/listings.js");


const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, error);
    } else {
        next()
    };
}

//index route 
router.get("/", wrapAsync(listingController.index));

//new route
router.get("/new",listingController.newForm);


//create route
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

//show route
router.get("/:id", wrapAsync(listingController.showListings));

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderForm));

//update route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

//delete route 
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;