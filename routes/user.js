const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const LocalStrategy = require("passport-local");




// sign up route 
router.get("/signup",async(req,res)=> {
    res.render("users/signup.ejs")
})

router.post("/signup",wrapAsync(async(req,res)=> {
    try {
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);    
        req.flash("success","Welcome To WanderLust");
        res.redirect("/listings");
    }catch(err){
        req.flash("errors",err.message);
        res.redirect("/signup");
    }
}));

// signin route 

router.get("/signin",(req,res)=>{
    res.render("users/signin.ejs")
})

router.post("/signin", passport.authenticate("local", {
    failureRedirect : "/signin",
    failureFlash : true,
}) 
,wrapAsync(async(req,res) => {
    req.flash("success", "Welcome Back To Wanderlust");
    res.redirect("/listings");
}));

module.exports = router;