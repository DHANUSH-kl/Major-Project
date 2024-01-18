const Listing = require("./models/listing");


module.exports.isLoggedIn = (req,res,next)=> {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("errors", "You must Be Logged In");
        return res.redirect("/signin");
    }
    next();
} 

module.exports.saveRedirectUrl = (req,res,next)=> {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("errors","You Are Not The Owner Of This Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}