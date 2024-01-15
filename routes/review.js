const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");




const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, error);
    } else {
        next()
    };
}


//review post route
router.post("/", validateReview, wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
}))

//review delete route
router.delete("/:reviewid",
    wrapAsync(async (req, res) => {
        let { id, reviewid } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
        await Review.findByIdAndDelete(reviewid);
        res.redirect(`/listings/${id}`);
    }))

module.exports = router;