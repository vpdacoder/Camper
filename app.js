var express                 = require("express");
    app                     = express();
    bodyParser              = require('body-parser');
    mongoose                = require('mongoose');
    Campground              = require('./models/campground');
    Comment                 = require('./models/comment');
    seedDB                  = require('./seed');
    passport                = require('passport');
    User                    = require('./models/user')
    LocalStrategy           = require('passport-local');
    passportLocalMongoose   = require('passport-local-mongoose');

mongoose.connect("mongodb://localhost/camper");

seedDB();


// PASSPORT CONFIG
app.use(require("express-session")({
  secret: "Top secret",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// CONFIG METHODS THAT COME WITH PASSPORT-LOCAL-MONGOOSE
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));


// ________________
// MIDDLEWARE
// ________________
app.use((req,res,next)=>{
  //whatever is put into res.locals is available inside the templates
  res.locals.currentUser = req.user;
  next();
});


let isLoggedIn = (req,res,next) =>{
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

// ==========================
// MAIN ROUTES
// ==========================

// LANDING PAGE/HOME PAGE ROUTE

app.get("/", (req,res)=>{
  res.render('landing');
});

// SHOW CAMPGROUNDS

app.get('/campgrounds', (req,res)=>{
  console.log(req.user);
  // Get all campgrounds from //
  Campground.find({}, (err, campgrounds)=> {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/campgrounds", {campgrounds:campgrounds});
    }
  });
});

// SHOW NEW CAMPGROUND FORM

app.get("/campgrounds/new", (req,res)=>{
  res.render("campgrounds/new");
});

// ADD NEW CAMPGROUND

app.post("/campgrounds", (req,res)=> {
  // create a new campground
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name: name,image: image};

  Campground.create(newCampground, (err, newCamp) =>{
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});


//SHOW ROUTE FOR A PARTICULAR CAMP

app.get("/campgrounds/:id", function(req,res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      res.redirect("/campgrounds");
    } else {
      res.render("campgrounds/show", {campground:foundCampground});
    }
  })
});


// ==========================
// COMMENTS ROUTES
// ==========================


app.post("/campgrounds/:id/comments", isLoggedIn, (req,res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, (err, comment)=>{
        if(err){
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save()
          res.redirect("/campgrounds/" + req.params.id);
        }
      });
    }
  });
});

app.get("/campgrounds/:id/comments/new", isLoggedIn, (req,res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new",{campground:campground});
    }
  })
});





// +++++++++++++++++++++++
// AUTH ROUTES
// +++++++++++++++++++++++

// SHOW SIGN-UP form
app.get('/register',(req,res)=> {
  res.render('register');
});

// SIGN-UP LOGIC
app.post('/register', (req,res)=>{
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
app.get('/login',(req,res)=> {
  res.render('login');
});

// LOGIN LOGIC
app.post('/login',passport.authenticate("local",{
   successRedirect: "/campgrounds",
   failureRedirect: "/login"
 }),(req,res)=>{
 });


 // LOGOUT
app.get('/logout', (req,res)=>{
   req.logout();
   res.redirect('/campgrounds');
 })














// STARTING THE SERVER

app.listen(3000, (req,res) =>{
  console.log("3000 is the magic port");
});
