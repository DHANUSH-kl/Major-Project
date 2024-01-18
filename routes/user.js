const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { saveRedirectUrl } = require("../middleware.js");

const userController  = require("../controller/users.js")


// sign up route 
router.get("/signup",userController.renderSignUpForm)

router.post("/signup",wrapAsync(userController.signup));

// signin route 

router.get("/signin",userController.renderLoginForm)

router.post("/signin",saveRedirectUrl , passport.authenticate("local", {
    failureRedirect : "/signin",
    failureFlash : true,
}) 
,wrapAsync(userController.login));

// logout route 
router.get("/logout",userController.logout)

module.exports = router;