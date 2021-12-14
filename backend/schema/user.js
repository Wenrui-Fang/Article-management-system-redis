const joi = require("joi");
/**
 * string() value must be a string
 * The value of alphanum() can only be a string containing a-zA-Z0-9
 * min(length) minimum length
 * max(length) maximum length
 * required() value is required and cannot be undefined
 * pattern (regular expression) value must conform to the rules of regular expression
 */
// Username verification rules
const username = joi.string().alphanum().min(1).max(15).required();

const password = joi
  .string()
  .pattern(/^[\S]{6,18}$/)
  .required();

// Define verification rules for id, nickname, emial
const userId = joi.string().required();
const nickName = joi.string().required();
const email = joi.string().email().required();

exports.reg_login_schema = {
  body: {
    username,
    password,
  },
};

// Validation rule object-update user basic information
exports.update_userinfo_schema = {
  body: {
    userId,
    nickName,
    email,
  },
};

// Validation rule object-reset password
exports.update_password_schema = {
  body: {
    // Use the password rule to verify the value of req.body.oldPwd
    oldPwd: password,
    // Use the joi.not(joi.ref('oldPwd')).concat(password) rule to verify the value of req.body.newPwd
    // Interpretation:
    // 1. joi.ref('oldPwd') means that the value of newPwd must be consistent with the value of oldPwd
    // 2. joi.not(joi.ref('oldPwd')) means that the value of newPwd cannot be equal to the value of oldPwd
    // 3. .concat() is used to merge the two verification rules joi.not(joi.ref('oldPwd')) and password
    newPwd: joi.not(joi.ref('oldPwd')).concat(password),
  },
}