const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const departmentsController = require('../controllers/Department');


//GET /departments
router.get('/', departmentsController.getAll)

//PUT /categories/
router.put('/',
    [
        body("departmentName").trim()
            .isLength({ min: 2, max: 30 }),
        body("categories").trim()
            .isLength({ min: 2, max: 30 }),
    ],
    departmentsController.createDepartment);


module.exports = router;
