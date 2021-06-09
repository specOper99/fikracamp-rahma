const express = require('express');
const router = express.Router();

const productsController = require('../controllers/Product');

const { body } = require('express-validator');
const multer = require('multer');

//GET /products
router.get('/', productsController.getAll);

//GET /products/:id
router.get('/:id', productsController.getById);

//GET /products/:category
router.get('/:category', productsController.getByCategory);

//GET /products/:department
router.get('/:department', productsController.getByDepartment);

//DELETE /products/:id
router.delete('/:id', productsController.deleteById);




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
            .isLength({ min: 2 }),
        body("description").trim()
            .isLength({ min: 2 }),
        body("category").trim()
            .isLength({ min: 2 }),
        body("price").trim()
            .isLength({ min: 2 }),
        body("quantity").trim()
            .isDecimal(),
    ],
    productsController.createProduct);


module.exports = router;
