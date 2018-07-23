var express   = require("express");
    router    = express.Router();
    passport  = require('passport');
    user      = require('../models/user');


// LANDING PAGE/HOME PAGE ROUTE
router.get("/", (req,res)=>{
  res.render('landing');
});


// MIDDLEWARE
let isLoggedIn = (req,res,next) =>{
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}


// +++++++++++++++++++++++
// AUTH ROUTES
// +++++++++++++++++++++++

// SHOW SIGN-UP form
router.get('/register',(req,res)=> {
  res.render('register');
});

// SIGN-UP LOGIC
router.post('/register', (req,res)=>{
  let newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user)=>{
    if (err) {
      console.log(err);
      return res.render('register');
    } else {
      // can change "local" to "twitter" or "google" to use different strategies
      // log the user in
      passport.authenticate("local")(req,res,()=>{
        res.redirect('/campgrounds');
      });
    }
  });
});


// SHOW LOGIN FORM
router.get('/login',(req,res)=> {
  res.render('login');
});

// LOGIN LOGIC
router.post('/login',passport.authenticate("local",{
   successRedirect: "/campgrounds",
   failureRedirect: "/login"
 }),(req,res)=>{
 });


 // LOGOUT
router.get('/logout', (req,res)=>{
   req.logout();
   res.redirect('/campgrounds');
 })


 module.exports = router;
