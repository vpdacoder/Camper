var express    = require("express");
    router     = express.Router();
    Campground = require('../models/campground');
    middleware = require('../middleware');


// SHOW CAMPGROUNDS
router.get('/', (req,res)=>{
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
router.get("/new", middleware.isLoggedIn,(req,res)=>{
  res.render("campgrounds/new");
});


// CREATE -- ADD NEW CAMPGROUND
router.post("/", middleware.isLoggedIn, (req,res)=> {
  // create a new campground
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username,
  };

  var newCampground = {name: name,image: image, description:description, author: author};

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


// EDIT CAMPGROUND FORM
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req,res)=>{
  Campground.findById(req.params.id, (err,campground)=>{
    res.render('campgrounds/edit',{campground:campground});
  });
});


// UPDATE ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, (req,res)=>{
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err,campground)=>{
    if(err){
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds/'+ req.params.id);
    }
  })
});

// DESTROY ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, (req,res)=>{
    Campground.findByIdAndRemove(req.params.id, (err)=>{
      if (err) {
        res.redirect('/campgrounds');
      } else {
        res.redirect('/campgrounds')
      }
    });
});






module.exports = router;
