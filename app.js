var express    = require("express");
    app        = express();
    bodyParser = require('body-parser');
    mongoose   = require('mongoose');
    Campground = require('./models/campground');
    Comment    = require('./models/comment');
    seedDB     = require('./seed');
    // request    = require('request');

mongoose.connect("mongodb://localhost/camper");

seedDB();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", (req,res)=>{
  res.render('landing');
});

app.get('/campgrounds', (req,res)=>{
  // Get all campgrounds from //
  Campground.find({}, (err, campgrounds)=> {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/campgrounds", {campgrounds:campgrounds});
    }
  });
});


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

app.get("/campgrounds/new", (req,res)=>{
  res.render("campgrounds/new");
});

//SHOW ROUTE
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

app.post("/campgrounds/:id/comments", (req,res)=>{
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

app.get("/campgrounds/:id/comments/new", (req,res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new",{campground:campground});
    }
  })
});

app.listen(3000, (req,res) =>{
  console.log("3000 is the magic port");
});
