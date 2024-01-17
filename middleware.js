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