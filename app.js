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
    methoOverride           = require('method-override');
    flash                   = require('connect-flash');
 
var commentRoutes           = require('./routes/comment');
    campgroundRoutes        = require('./routes/campgrounds');
    indexRoutes             = require('./routes/index');

mongoose.connect("mongodb://localhost/camper");

// seedDB();



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


app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methoOverride("_method"));
app.use(flash());

// ++++++++++++++++
// MIDDLEWARE
// ++++++++++++++++

app.use((req,res,next)=>{
  //whatever is put into res.locals is available inside the templates
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});


// ROUTES
app.use('/',indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);




// STARTING THE SERVER
app.listen(3000, (req,res) =>{
  console.log("3000 is the magic port");
});
