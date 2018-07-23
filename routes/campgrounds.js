var express    = require("express");
    router     = express.Router();
    Campground = require('../models/campground');


// MIDDLEWARE
    let isLoggedIn = (req,res,next) =>{
      if(req.isAuthenticated()){
        return next();
      }
      res.redirect("/login");
    }



// SHOW CAMPGROUNDS

router.get('/', (req,res)=>{
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

router.get("/new", isLoggedIn,(req,res)=>{
  res.render("campgrounds/new");
});

// CREATE -- ADD NEW CAMPGROUND

router.post("/", isLoggedIn, (req,res)=> {
  // create a new campground
  var name = req.body.name;
  var image = req.body.image;
  var author = {
    id: req.user._id,
    username: req.user.username,
  };

  var newCampground = {name: name,image: image, author: author};

  Campground.create(newCampground, (err, newCamp) =>{
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});


//SHOW ROUTE FOR A PARTICULAR CAMP

router.get("/:id", function(req,res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      res.redirect("/campgrounds");
    } else {
      res.render("campgrounds/show", {campground:foundCampground});
    }
  })
});

module.exports = router;
