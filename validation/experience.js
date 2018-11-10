const Validator = require("validator");
const isEmpty = require("./is-empty");
let validateExperienceInput = data => {
  let errors = {};

  data.title = isEmpty(data.title) ? "" : data.title;
  data.company = isEmpty(data.company) ? "" : data.company;
  data.from = isEmpty(data.from) ? "" : data.from;

  if (Validator.isEmpty(data.title)) {
    errors.title = "Job title is required";
  }
  if (Validator.isEmpty(data.company)) {
    errors.company = "Company name is required";
  }
  if (Validator.isEmpty(data.from)) {
    errors.from = "Date when started is required";
  }
  return { errors, isValid: isEmpty(errors) };
};

module.exports = validateExperienceInput;
