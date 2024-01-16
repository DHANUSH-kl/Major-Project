module.exports.isLoggedIn = (req,res,next)=> {
    if(!req.isAuthenticated()){
        req.flash("errors", "You must Be Logged In");
        return res.redirect("/signin");
    }
    next();
} 