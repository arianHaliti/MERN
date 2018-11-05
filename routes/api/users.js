require("../../server/config/config");
const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// Load User Model
const User = require("./../../models/User");

// @route    GET api/users/test
// @desc     Tests users route
// @access   Public
router.get("/test", (req, res) => {
  res.json({
    msg: "Users works"
  });
});

// @route    GET api/users/regiter
// @desc     Register user
// @access   Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) return res.status(400).json({ email: "email already exist" });

    const avatar = gravatar.url(req.body.email, {
      s: "200", //Size
      r: "pg", //Rating
      d: "mm" // Default
    });
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      avatar,
      password: req.body.password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => {
            res.json(user);
          })
          .catch(e => console.log(e));
      });
    });
  });
});

// @route    GET api/users/login
// @desc     Login User(JWT)
// @access   Public
router.post("/login", (req, res) => {
  email = req.body.email;
  password = req.body.password;
  User.findOne({ email }).then(user => {
    if (!user) return res.status(404).json({ error: "Wrong Credentials" });
    bcrypt.compare(password, user.password).then(bool => {
      if (!bool) return res.status(404).json({ error: "Wrong Credentials" });

      let payload = {
        _id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      };

      jwt.sign(
        payload,
        process.env.SECRET_KEY,
        { expiresIn: 3600 },
        (err, token) => {
          res.json({
            msg: "success",
            token: "Bearer " + token
          });
        }
      );
    });
  });
});
// @route    GET api/users/current
// @desc     Return current user
// @access   Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
