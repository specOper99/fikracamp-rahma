const { validationResult } = require('express-validator');

const Blog = require('../models/Blog');

const fs = require('fs');
const path = require('path');

module.exports.getAll = (req, res, next) => {
    Blog.find()
        .then(posts => {
            res.json({ posts: posts });
        })
        .catch(err => next(err));
}

module.exports.deleteAll = (req, res, next) => {
    Blog.find()
        .then(posts => {
            if (!posts || !posts.length) {
                return res.status(404).json({ message: "posts not found" })
            }
            posts.forEach(post => post.delete());
        })
        .catch(err => next(err));
}

module.exports.getById = (req, res, next) => {
    let postId = req.params.id;
    Blog.findById(postId)
        .then(post => {
            if (!post) {
                return res.status(404).json({ message: "post not found" })
            }
            res.json({ post: post });
        })
        .catch(err => next(err));
}

module.exports.deleteById = (req, res, next) => {
    let postId = req.params.id;
    Blog.findById(postId)
        .then(post => {
            if (!post) {
                return res.status(404).json({ message: "post not found" })
            }
            post.delete();
            res.json({ post: post });
        })
        .catch(err => next(err));
}

module.exports.createPost = (req, res, next) => {
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
    const newPath = path.join('public', 'blog', body.title + new Date().toISOString() + req.file.originalname.substring(req.file.originalname.lastIndexOf('.')));
    moveImage(req.file.path, newPath)
    body.image = newPath;

    Blog.create({ ...body })
        .then(post => {
            res.json({ post: post });
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
