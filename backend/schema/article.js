// Import the module that defines the validation rules
const joi = require('joi')
// Define validation rules for title, category ID, content, and release status
const title = joi.string().required()
const cateId = joi.string().required()
const content = joi.string().required().allow('')
const state = joi.string().valid('published', 'draft').required()
// Validation Rule Object-Post Article
exports.add_article_schema = {
    body: {
        title,
        cateId,
        content,
        state,
    },
}