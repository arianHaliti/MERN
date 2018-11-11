const express = require("express");
const router = express.Router();
const passport = require("passport");

// Load Post model
const Post = require("../../models/Post");

// Load Validator Posts
const validatePostInput = require("../../validation/post");
// @route    GET api/posts/test
// @desc     Tests post route
// @access   Public
router.get("/test", (req, res) => {
  res.json({
    msg: "posts works"
  });
});

// @route    Post api/posts
// @desc     Tests post route
// @access   Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let { errors, isValid } = validatePostInput(req.body);
    if (!isValid) return res.status(400).json(errors);
    let post = new Post({
      user: req.user.id,
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar
    });
    post
      .save()
      .then(post => {
        res.json(post);
      })
      .catch(e => res.status(400).json(e));
  }
);

module.exports = router;
