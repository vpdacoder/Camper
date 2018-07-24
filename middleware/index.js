// ALL MIDDLEWARE GOES HERE
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middlewareObj = {};

 middlewareObj.isLoggedIn = (req,res,next) =>{
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "Please Login First!");
  res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = (req,res,next)=> {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err,campground)=>{
      if (err) {
        res.redirect('back');
      } else {
        // does user own the campground?
        // CAN'T do campground.author.id (mongoose object) === req.user._id because its moogose object and string conflict eventhough they look the same while console.loging
        if(campground.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

middlewareObj.checkCommentOwnership = (req,res,next)=> {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err,comment)=>{
      if (err) {
        res.redirect('back');
      } else {
        // does user own the comment?
        // CAN'T do comment.author.id (mongoose object) === req.user._id because its moogose object and string conflict eventhough they look the same while console.loging
        if(comment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}



module.exports = middlewareObj;
