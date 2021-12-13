// Import the module that defines the validation rules
const joi = require('joi')
// Define verification rules for category name and category alias
const name = joi.string().required()
const alias = joi.string().alphanum().required()

// Define the verification rules for category Id
const id = joi.string().required()


// Validation rule object-add classification
exports.add_cate_schema = {
    body: {
        name,
        alias,
    },
}

// Validation rule object-delete classification
exports.delete_cate_schema = {
    params: {
        id,
    },
}

// Validation rule object-get classification based on Id
exports.get_cate_schema = {
    params: {
        id,
    },
}

// Validation rule object-update classification
exports.update_cate_schema = {
    body: {
        cateId: id,
        name,
        alias,
    },
}