const { validationResult } = require('express-validator');

const BlogCategory = require('../models/BlogCategory');

module.exports.getAll = (req, res, next) => {
    BlogCategory.find()
        .then(categories => {
            if (!categories || !categories.length) {
                return res.status(404).json({ message: "No categories found" })
            }
            res.status(200).json({ categories: categories });
        })
        .catch(err => next(err));
}

module.exports.deleteById = (req, res, next) => {
    let categoryId = req.params.id;
    BlogCategory.findById(categoryId)
        .then(categoryId => {
            if (!categoryId) {
                return res.status(404).json({ message: "categoryId not found" })
            }
            categoryId.delete();
            res.json({ categoryId: categoryId });
        })
        .catch(err => next(err));
}

module.exports.createCategory = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        let inputDataErrors = '';
        errors.array().forEach((item, index) => {
            inputDataErrors = inputDataErrors.concat(`error ${index + 1}: ${item.msg} - in: ${item.param}${index + 1 < errors.array().length ? ', ' : ''}`);
        });
        const error = new Error('Validation failed, entered data is incorrect. { ' + inputDataErrors + ' }');
        error.statusCode = 422;
        return next(error);
    }

    const body = req.body;

    BlogCategory.create({ ...body })
        .then(categoryId => {
            res.json({ categoryId: categoryId });
        })
        .catch(err => {
            next(err)
        });
}