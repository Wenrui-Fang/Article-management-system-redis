// Import express
const express = require("express");
// Create route object
const router = express.Router();

// Import user information processing function module
const userinfo_handler = require("../router_handler/userinfo");

// Import middleware to verify the validity of data
const expressJoi = require("@escook/express-joi");

// Import the required validation rule objects
const { update_userinfo_schema, update_password_schema} = require('../schema/user')

// Get user's basic infomation
router.get("/userinfo", userinfo_handler.getUserInfo);

// Update user's basic infomation
router.post(
  "/userinfo",
  expressJoi(update_userinfo_schema),
  userinfo_handler.updateUserInfo
);

// Update user's pwd
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePassword)

// Export routing objects
module.exports = router;
