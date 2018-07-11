var express    = require("express");
    app        = express();
    bodyParser = require('body-parser');
    // request    = require('request');

app.use(express.static("public"));
// app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine","ejs");

app.get("/", (req,res)=>{
  res.render('landing');
});

app.get('/campgrounds', (req,res)=>{
  let campgrounds = [
    {name: "Salmaon Creek", image:"https://images.unsplash.com/photo-1496080174650-637e3f22fa03?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b7ca353cfcc4299e6c3d431ff862e1cf&auto=format&fit=crop&w=500&q=60"},
    {name: "Granite Hill", image:"https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5cedc6b95f731395da7269d2341f9a5e&auto=format&fit=crop&w=500&q=60"},
    {name: "Mountain Goat's Rest", image:"https://images.unsplash.com/photo-1496545672447-f699b503d270?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ba3fa37b995a705a01d022cada13f726&auto=format&fit=crop&w=500&q=60"}
  ]
  res.render("campgrounds", {campgrounds:campgrounds});
});

app.post("/campgrounds", (req,res)=> {
  res.send("you hit the post route");
});

app.get("/campgrounds/new", (req,res)=>{
  res.render("new");
});

app.listen(3000, (req,res) =>{
  console.log("3000 is the magic port");
});
