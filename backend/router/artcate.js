const express = require('express')
const router = express.Router()
// Import the routing processing function module for article classification
const artcate_handler = require('../router_handler/artcate')
// Import and delete validation rule objects for classification
const { delete_cate_schema } = require('../schema/artcate')

// Middleware for importing verification data
const expressJoi = require('@escook/express-joi')
// Import the verification module for article classification
const { add_cate_schema } = require('../schema/artcate')
// Import the validation rule objects that are classified according to the Id
const { get_cate_schema } = require('../schema/artcate')
// Import the validation rule object that updates the article classification
const { update_cate_schema } = require('../schema/artcate')

// Get list data of article classification
router.get('/cates', artcate_handler.getArticleCates)
// Add routing for article classification
router.post('/addcates', expressJoi(add_cate_schema), artcate_handler.addArticleCates)
// Delete the route of the article category
router.get('/deletecate/:id', expressJoi(delete_cate_schema), artcate_handler.deleteCateById)

router.get('/cates/:id', expressJoi(get_cate_schema), artcate_handler.getArticleById)

// 更新文章分类的路由
router.post('/updatecate', expressJoi(update_cate_schema), artcate_handler.updateCateById)

module.exports = router