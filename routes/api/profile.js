const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Profile model
const Profile = require("../../models/Profile");

// Load User model
const User = require("../../models/User");

//Load Profile Validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");
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
    let profileObject = {
      // user: req.user.id,
      // handle: req.body.handle,
      // company: req.body.company,
      // website: req.body.website,
      // location: req.body.location,
      // status: req.body.status,
      // bio: req.body.bio,
      // githubusername: req.body.githubusername,
      // skills: req.body.skills.split(","),
      // social: {
      //   youtube: req.body.youtube,
      //   twitter: req.body.twitter,
      //   facebook: req.body.facebook,
      //   linkedin: req.body.linkedin,
      //   instagram: req.body.instagram
      // }
    };
    profileObject.user = req.user.id;
    if (req.body.handle) profileObject.handle = req.body.handle;
    if (req.body.company) profileObject.company = req.body.company;
    if (req.body.website) profileObject.website = req.body.website;
    if (req.body.location) profileObject.location = req.body.location;
    if (req.body.status) profileObject.status = req.body.status;
    if (req.body.bio) profileObject.bio = req.body.bio;
    if (req.body.githubusername)
      profileObject.githubusername = req.body.githubusername;
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

        console.log("EDIT");
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileObject },
          { new: true }
        ).then(profile => res.send(profile));
      } else {
        //Create
        console.log("CREATE");
        //Check if handler in use
        Profile.findOne({ handle: profileObject.handle }).then(profile => {
          if (profile) {
            errors.handle = "The handle is already in use";
            return res.status(400).json(errors);
          }
          // Save Profile
          new Profile(profileObject).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// @route    GET api/profile/handle/:handle
// @desc     Get a profile by its handle
// @access   Public
router.get("/handle/:handle", (req, res) => {
  let errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.profile = "profile not found ";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(e => {
      errors.profile = "profile not found";
      res.status(404).json(errors);
    });
});

// @route    GET api/profile/user/:user_id
// @desc     Get a profile by its user_id
// @access   Public
router.get("/user/:user_id", (req, res) => {
  let errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.profile = "profile not found ";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(e => {
      errors.profile = "profile not found";
      res.status(404).json(errors);
    });
});

// @route    GET api/profile/all
// @desc     Get a array of all profiles
// @access   Public
router.get("/all", (req, res) => {
  let errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.profile = "No profiles found";
        res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(e => {
      errors.profile = "No profiles found !";
      res.status(404).json(errors);
    });
});

// @route    POST api/profile/experience
// @desc     Post for experience
// @access   Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
      console.log(errors);
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (!profile) {
        errors.profile = "No profile found";
        return res.status(400).json(errors);
      }
      let experience = {
        title: req.body.title,
        company: req.body.title,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      profile.experience.unshift(experience);
      profile.save().then(profile => {
        res.json(profile);
      });
    });
  }
);

// @route    POST api/profile/education
// @desc     Post for education
// @access   Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (!profile) {
        errors.profile = "No profile found";
        return res.status(400).json(errors);
      }
      let education = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      profile.education.unshift(education);
      profile.save().then(profile => {
        res.json(profile);
      });
    });
  }
);

// @route    DELETE api/profile/education/:edu_id
// @desc     delete for education
// @access   Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.profile = "No Profile found";
          return res.status(400).json(errors);
        }
        // Get the id of the education
        let removeIndex = profile.education
          .map(item => item.id) // ?
          .indexOf(req.params.edu_id);

        // Splice out of array
        profile.education.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(e => res.status(404).json(e));
  }
);

// @route    DELETE api/profile/experience/:exp_id
// @desc     delete for experience
// @access   Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.profile = "No profile found";
          return res.status(400).json(errors);
        }
        // console.log(req.params.exp_id);
        let removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        profile.save().then(profile => res.json(profile));
      })
      .catch(e => res.status(404).json(e));
  }
);

// @route    DELETE api/profile/
// @desc     delete user and profile
// @access   Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() => {
        res.json({ success: "true" });
      });
    });
  }
);

module.exports = router;
