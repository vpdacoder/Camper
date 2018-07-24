var express     = require("express");
    router      = express.Router({mergeParams: true});
    Campground  = require('../models/campground');
    Comment     =require('../models/comment');

// MIDDLEWARE
let isLoggedIn = (req,res,next) =>{
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}


// RENDER NEW COMMENT FORM
router.get("/new", isLoggedIn, (req,res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new",{campground:campground});
    }
  })
});


// COMMENT POST ROUTE
router.post("/", isLoggedIn, (req,res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, (err, comment)=>{
        if(err){
          console.log(err);
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          campground.comments.push(comment);
          campground.save()
          res.redirect("/campgrounds/" + req.params.id);
        }
      });
    }
  });
});

// EDIT COMMENT ROUTE
router.get("/:comment_id/edit", (req,res) =>{
  Comment.findById(req.params.comment_id, (err, comment)=>{
    if(err){
      res.redirect('/campgrounds');
    } else {
      res.render('comments/edit', {campground_id: req.params.id, comment:comment});
    }
  });
});

// UPDATE Comment
router.put('/:comment_id', (req,res)=>{
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err,comment)=>{
    if (err) {
      res.redirect("back");
    } else {
      res.redirect('/campgrounds/'+ req.params.id);
    }
  });
});

// DELETE Comment
router.delete("/:comment_id", (req,res)=>{
  Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
    if(err){
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/"+ req.params.id)
    }
  });
});

module.exports = router;
