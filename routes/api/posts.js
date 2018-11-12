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

// @route    GET api/posts
// @desc     Gets all the posts
// @access   Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      res.json(posts);
    })
    .catch(e => res.status(400).json({ message: "No Posts found" }));
});
// @route    GET api/post/:id
// @desc     Get a single post
// @access   Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      res.json(post);
    })
    .catch(e => res.status(400).json({ message: " Post not found" }));
});
// @route    DELETE api/post/:id
// @desc     Delete a post
// @access   Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (post.user.toString() !== req.user.id) {
          res.status(401).json({ noauthorized: "User not authorized" });
        }
        post
          .remove()
          .then(() => {
            res.json({ message: "Post deleted" });
          })
          .catch(e =>
            res.status(400).json({ message: "Could not delete Post" })
          );
      })
      .catch(e => res.status(400).json({ message: "Could not find post" }));
  }
);

module.exports = router;
