const Listing=require("../models/listing");

module.exports.index = async (req, res) => {
    let allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
}

module.exports.newForm =  (req, res) => {
    res.render("listings/new.ejs")
}

module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}

module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    let listings = await Listing.findById(id).populate({
        path: "reviews",
        populate : {
            path : "author",
        },
    }).populate("owner");
    if (!listings) {
        req.flash("errors", "Listing  You  Are  Trying  To  Access  Does  Not  Exist")
        res.redirect("/listings")
    } else {
        res.render("listings/show.ejs", { listings });
    }

}

module.exports.renderForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("errors", "Listing  You  Are  Trying  To  Access  Does  Not  Exist")
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs", { listing })

}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}