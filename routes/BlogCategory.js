const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const categoriesController = require('../controllers/Category');


//GET /categories
router.get('/', categoriesController.getAll)


//DELETE /categories/:id
router.delete('/:id', categoriesController.deleteById);

//PUT /categories/
router.put('/',
    [
        body("categoryName").trim()
            .isLength({ min: 2, max: 30 }),
    ],
    categoriesController.createCategory);

module.exports = router;
