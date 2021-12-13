const express = require('express')
const router = express.Router()
// Import user routing processing function module
const userHandler = require('../router_handler/user')

// 1. Import middleware for validating form data
const expressJoi = require('@escook/express-joi')
// 2. Import the required validation rule objects
const { reg_login_schema } = require('../schema/user')


// Register a new user
router.post('/reguser', expressJoi(reg_login_schema), userHandler.regUser)
// Log in
router.post('/login', expressJoi(reg_login_schema), userHandler.login)
module.exports = router