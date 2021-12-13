// Import the express module
const express = require("express");
// Create an express server instance
const app = express();

const joi = require("joi");

// Import cors middleware
const cors = require("cors");
// Register cors as a global middleware
app.use(cors());

app.use(express.urlencoded({ extended: false }));

// Host static resource files
app.use("/uploads", express.static("./uploads"));

// Host static resource files
app.use('/uploads', express.static('./uploads'))

// Middleware that responds to data
app.use(function (req, res, next) {
  // status = 0 is success; status = 1 is failure; the value of status is set to 1 by default, which is convenient for handling failures
  res.cc = function (err, status = 1) {
    res.send({
      // state
      status,
      // State description, determine whether err is an error object or a string
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

// Import configuration file
const config = require("./config");
// Middleware for parsing token
const expressJWT = require("express-jwt");
// Use .unless({ path: [/^\/api\//] }) to specify which interfaces do not require Token authentication
app.use(
  expressJWT({ secret: config.jwtSecretKey }).unless({
    path: [/^\/api\//],
  })
);

// Import and register user routing module
const userRouter = require("./router/user");
app.use("/api", userRouter);

// Import and use user information routing module
const userinfoRouter = require("./router/userinfo");
// Note: The interfaces beginning with /my are all authorized interfaces and require Token authentication
app.use("/my", userinfoRouter);

// Import and use article classification routing module
const artCateRouter = require("./router/artcate");
// Mount a unified access prefix /my/article for the route of the article classification
app.use("/my/article", artCateRouter);

// Import and use the article routing module
const articleRouter = require("./router/article");
// Mount a unified access prefix /my/article for article routing
app.use("/my/article", articleRouter);

// error middleware
app.use(function (err, req, res, next) {
  // Data verification failed
  if (err instanceof joi.ValidationError) return res.cc(err);
  if (err.name === "UnauthorizedError")
    return res.cc("Identity authentication failed!");
  // unknown mistake
  res.cc(err);
});

// write your code here...
// Call the app.listen method, specify the port number and start the web server
app.listen(3007, function () {
  console.log("api server running at http://127.0.0.1:3007");
});
