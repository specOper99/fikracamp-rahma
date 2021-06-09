const express = require('express');

const router = express.Router();

const { body } = require('express-validator');
const multer = require('multer');

const blogController = require('../controllers/Blog');

//GET /blog
router.get('/', blogController.getAll);

//GET /blog/:id
router.get('/:id', blogController.getById);

// router.delete('/', blogController.deleteAll);

//DELETE /blog/:id
router.delete('/:id', blogController.deleteById);



const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'temp');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname.replace(' ', '--'));
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

router.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);


//PUT /blog/
router.put('/',
    [
        body("title").trim()
            .isLength({ min: 2, max: 30 }),
        body("description").trim()
            .isLength({ min: 2 }),
    ],
    blogController.createPost);


module.exports = router;
