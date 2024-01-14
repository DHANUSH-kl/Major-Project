const express = require("express");
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")));

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.get("/", (req, res) => {
    res.send("Welcome to the root page");
})


// app.get("/testlistings",async (req,res)=>{
//     // let sampleListing= new Listing({
//     //     title:"My new villa",
//     //     description:"by the beach",
//     //     price:1200,
//     //     location:"Calangute, Goa",
//     //     country:"India"
//     // });

//     // await sampleListing.save()
//     //     .then((res)=>{console.log(res)})
//     //     .catch((err)=>{console.log(err)})
//     // res.send("saved successfully")
// });

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, error);
    } else {
        next()
    };
}

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, error);
    } else {
        next()
    };
}

app.get("/listings", wrapAsync(async (req, res) => {
    let allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
}));

app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })

}));

app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listings/${id}`)
}));

app.post("/listings", validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing)
    await newListing.save();
    res.redirect("/listings")
}));

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//review route

app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
}))

//review delete route

app.delete("/listings/:id/reviews/:reviewid",
    wrapAsync(async (req, res) => {
        let {id,reviewid}=req.params;
        await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewid}});
        await Review.findByIdAndDelete(reviewid);
        res.redirect(`/listings/${id}`);
    }))

app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listings = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listings });
}));

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
    // res.status(statusCode).send(message);
})

app.listen(port, (req, res) => {
    console.log(`Server is listening to the post: ${port}`);
})