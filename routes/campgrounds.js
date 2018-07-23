var express    = require("express");
    router     = express.Router();
    Campground = require('../models/campground');




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

router.get("/new", (req,res)=>{
  res.render("campgrounds/new");
});

// ADD NEW CAMPGROUND

router.post("/", (req,res)=> {
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
