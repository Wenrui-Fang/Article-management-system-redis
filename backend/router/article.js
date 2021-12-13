//Article routing module
const express = require("express");
const router = express.Router();
// Import package that parses form data in formdata format
const multer = require("multer");
// Import the core module of the processing path
const path = require("path");

// Create an instance of multer, and specify the storage path of the file through the dest attribute
const upload = multer({ dest: path.join(__dirname, "../uploads") });

// Middleware for importing verification data
const expressJoi = require("@escook/express-joi");
// Import the verification module of the article
const { add_article_schema } = require("../schema/article");

// Import the routing processing function module of the article
const article_handler = require("../router_handler/article");
// Publish a new article
router.post(
  "/add",
  upload.single("coverImg"),
  expressJoi(add_article_schema),
  article_handler.addArticle
);

router.get("/list", article_handler.getArticleLists);

router.get("/delete/:id", article_handler.deleteArticleById);

module.exports = router;
