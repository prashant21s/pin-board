var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const sendVerificationEmail = require('../utils/sendEmail');
const userModel = require("../models/users");
const postModel = require("../models/post");
const passport = require("passport");
const upload = require("./multer");
const localStrategy = require("passport-local").Strategy;
passport.use(new localStrategy(userModel.authenticate()));
/* GET home page. */
router.get('/', function (req, res) {
  res.json({ message: "Pinterest Clone API running" });
});



router.get('/login',function (req,res,next){
  // console.log(req.flash('error'));
  
  res.render("login",{error: req.flash("error")});
});
router.get('/feed', async function (req, res, next) {
  try {
    const posts = await postModel.find().populate("user", "username fullname").sort({ createdAt: -1 });
    res.json({ posts });
  } catch (err) {
    next(err);
  }
});
router.post('/upload',isLoggedIn, upload.single("file") , async function (req,res,next){
  try {
  
    if(!req.file){
      return res.status(404).send("no files were given");
    }
   
    const user = await userModel.findOne({username: req.session.passport.user});
    const post = await postModel.create({
    image: req.file.path,
    imageText:req.body.filecaption,
    user: user._id
    });
    user.posts.push(post._id)
    await user.save();
    res.status(201).json({ success: true, post });
  } catch (err) {
    next(err);
  }
  });
  router.delete('/posts/:id', isLoggedIn, async function (req, res, next) {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const user = await userModel.findOne({ username: req.session.passport.user });
    if (post.user.toString() !== user._id.toString()) {
      return res.status(403).json({ error: "Not your post" });
    }

    await postModel.findByIdAndDelete(req.params.id);
    user.posts = user.posts.filter(p => p.toString() !== req.params.id);
    await user.save();

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});
router.post('/posts/:id/like', isLoggedIn, async function (req, res, next) {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const user = await userModel.findOne({ username: req.session.passport.user });
    const userId = user._id.toString();

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(id => id.toString() !== userId); // unlike
    } else {
      post.likes.push(userId); // like
    }
    await post.save();

    res.json({ likes: post.likes.length, liked: post.likes.includes(userId) });
  } catch (err) {
    next(err);
  }
});
router.get('/profile', isLoggedIn, async function (req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user }).populate("posts");
    res.json({ user });
  } catch (err) {
    next(err);
  }
});
router.post("/register", function (req, res) {
  const token = crypto.randomBytes(32).toString('hex');
  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname,
    verificationToken: token
  });

  userModel.register(userData, req.body.password)
    .then(async function (registeredUser) {
      try {
        await sendVerificationEmail(req.body.email, token);
        res.status(201).json({ success: true, message: "Check your email to verify your account" });
      } catch (err) {
        await userModel.findByIdAndDelete(registeredUser._id);
        res.status(502).json({ error: "Could not send verification email. Please try again later." });
      }
    })
    .catch(function (err) {
      res.status(400).json({ error: err.message });
    });
});

router.get('/verify/:token', async function (req, res, next) {
  try {
    const user = await userModel.findOne({ verificationToken: req.params.token });
    if (!user) return res.status(400).json({ error: "Invalid or expired link" });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ success: true, message: "Email verified! You can now log in." });
  } catch (err) {
    next(err);
  }
});

router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: "Invalid username or password" });
    if (!user.isVerified) return res.status(403).json({ error: "Please verify your email first" });
    req.logIn(user, function (err) {
      if (err) return next(err);
      return res.json({ success: true, user: { username: user.username, fullname: user.fullname } });
    });
  })(req, res, next);
});
router.get("/logout",function(req,res){
  req.logout(function(err){
    if (err) {return next(err);}

    res.json({ success: true});
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Not logged in" });
}
module.exports = router;
