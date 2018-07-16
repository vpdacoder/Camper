var express    = require("express");
    app        = express();
    bodyParser = require('body-parser');
    mongoose   = require('mongoose');
    Campground = require('./models/campground');
    seedDB     = require('./seed');
    // request    = require('request');

mongoose.connect("mongodb://localhost/camper");

seedDB();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine","ejs");

app.get("/", (req,res)=>{
  res.render('landing');
});

app.get('/campgrounds', (req,res)=>{
  // Get all campgrounds from //
  Campground.find({}, (err, campgrounds)=> {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds", {campgrounds:campgrounds});
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
  res.render("new");
});

app.get("/campgrounds/:id", (req,res)=>{
  res.render("show");
})
app.listen(3000, (req,res) =>{
  console.log("3000 is the magic port");
});
