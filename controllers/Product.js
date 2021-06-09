const { validationResult } = require('express-validator');

const Product = require('../models/Product');

const fs = require('fs');
const path = require('path');

module.exports.getAll = (req, res, next) => {
    Product.find()
        .then(products => {
            if (!products || !products.length) {
                return res.status(404).json({ message: "Products not found" })
            }
            res.json({ products: products });
        })
        .catch(err => next(err));
}

module.exports.getByCategory = (req, res, next) => {
    let category = req.params.category;
    Product.find({ $where: { category: category } })
        .then(products => {
            if (!products || !products.length) {
                return res.status(404).json({ message: "Products not found" })
            }
            res.json({ products: products });
        })
        .catch(err => next(err));
    // Product.getProductByID(productId, function (e, item) {
    //     if (e) {
    //         e.status = 404; return next(e);
    //     }
    //     else {
    //         res.json({ product: item })
    //     }
    // });
}

module.exports.getByDepartment = (req, res, next) => {
    let department = req.params.department;
    Product.find({ $where: { department: department } })
        .then(products => {
            if (!products || !products.length) {
                return res.status(404).json({ message: "Products not found" })
            }
            res.json({ products: products });
        })
        .catch(err => next(err));
}

module.exports.getById = (req, res, next) => {
    let productId = req.params.id;
    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({ message: "Product not found" })
            }
            res.json({ product: product });
        })
        .catch(err => next(err));
    // Product.getProductByID(productId, function (e, item) {
    //     if (e) {
    //         e.status = 404; return next(e);
    //     }
    //     else {
    //         res.json({ product: item })
    //     }
    // });
}

module.exports.deleteById = (req, res, next) => {
    let productId = req.params.id;
    Product.findById( productId )
        .then(product => {
            if (!product) {
                return res.status(404).json({ message: "Product not found" })
            }
            product.delete()
            res.json({ product: product });
        })
        .catch(err => next(err));
}


module.exports.createProduct = (req, res, next) => {
    if (!req.file) {
        const error = new Error('No image provided.');
        error.statusCode = 422;
        return next(error);
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        let inputDataErrors = '';
        errors.array().forEach((item, index) => {
            inputDataErrors = inputDataErrors.concat(`error ${index + 1}: ${item.msg} - in: ${item.param}${index + 1 < errors.array().length ? ', ' : ''}`);
        });
        const error = new Error('Validation failed, entered data is incorrect. { ' + inputDataErrors + ' }');
        error.statusCode = 422;
        clearImage(req.file.path);
        return next(error);
    }


    const body = req.body;
    const newPath = path.join('public', 'products', body.title + new Date().toISOString() + req.file.originalname.substring(req.file.originalname.lastIndexOf('.')));
    moveImage(req.file.path, newPath)
    body.image = newPath;

    Product.create({ ...body })
        .then(product => {
            res.json({ product: product });
        })
        .catch(err => {
            clearImage(newPath);
            next(err)
        });
}


const moveImage = (filePath, newFilePath) => {
    filePath = path.join(__dirname, '..', filePath);
    if (!fs.existsSync(newFilePath.substring(0, newFilePath.lastIndexOf('/')))) {
        fs.mkdirSync(newFilePath.substring(0, newFilePath.lastIndexOf('/')), { recursive: true });
    }
    // !fs.existsSync(newFilePath) && fs.mkdirSync(newFilePath);
    fs.rename(filePath, path.join(__dirname, '..', newFilePath), err => err && console.log('move error', err));
};

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', `${filePath}`);
    console.log(filePath)
    if (fs.existsSync(filePath))
        fs.unlink(filePath, err => err && console.log('clear error', err));
};
