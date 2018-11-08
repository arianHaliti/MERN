const Validator = require("validator");
const isEmpty = require("./is-empty");
let validateLoginInput = data => {
  let errors = {};

  data.email = isEmpty(data.email) ? "" : data.email;
  data.password = isEmpty(data.password) ? "" : data.password;

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is not valid";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  }
  return { errors, isValid: isEmpty(errors) };
};
module.exports = validateLoginInput;
