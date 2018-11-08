const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Profile model
const Profile = require("../../models/Profile");

//Load Profile Validation
const validateProfileInput = require("../../validation/profile");

// @route    GET api/profile/test
// @desc     Tests profile route
// @access   Public
router.get("/test", (req, res) => {
  res.json({
    msg: "profile works"
  });
});

// @route    GET api/profile
// @desc     Get current users profile
// @access   Private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is not profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(e => {
        return res.status(404).json(e);
      });
  }
);

// @route    POST api/profile
// @desc     Create or update profile
// @access   Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    let profileObject = {};
    profileObject.user = req.user.id;
    if (req.body.handle) profileObject.handle = req.body.handle;
    if (req.body.company) profileObject.company = req.body.company;
    if (req.body.website) profileObject.website = req.body.website;
    if (req.body.location) profileObject.location = req.body.location;
    if (req.body.status) profileObject.status = req.body.status;
    if (req.body.bio) profileObject.bio = req.body.bio;
    if (req.body.githubusername)
      profileObject.githubusername = req.githubusername.handle;
    if (typeof req.body.skills !== "undefined")
      profileObject.skills = req.body.skills.split(",");
    profileObject.social = {};
    if (req.body.youtube) profileObject.social.youtube = req.body.youtube;
    if (req.body.twitter) profileObject.social.twitter = req.body.twitter;
    if (req.body.facebook) profileObject.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileObject.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileObject.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //EDIT
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileObject },
          { new: true }
        ).then(profile => res.send(profile));
      } else {
        //Create

        //Check if handler in use
        Profile.findOne({ handle: profileObject.handle }).then(profile => {
          if (profile) {
            error.handle = "The handle is already in use";
            return res.status(400).json(error);
          }
          // Save Profile
          new Profile(profileObject).save().then(profile => res.json(profile));
        });
      }
    });
  }
);
module.exports = router;
