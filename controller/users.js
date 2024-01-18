const User = require("../models/user");

module.exports.renderSignUpForm = async(req,res)=> {
    res.render("users/signup.ejs")
}

module.exports.signup = async(req,res)=> {
    try {
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);    
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }else {
                req.flash("success","Welcome To WanderLust");
                res.redirect("/listings");        
            }
        })
    }catch(err){
        req.flash("errors",err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/signin.ejs")
}

module.exports.login = async(req,res) => {
    req.flash("success", "Welcome Back To Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next) => {
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
    });
    req.flash("success","User Logged Out Successfully");
    res.redirect("/listings");
}