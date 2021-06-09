const { validationResult } = require('express-validator');

const Department = require('../models/Department');

module.exports.getAll = (req, res, next) => {
    Department.find()
        .then(departments => {
            if (!departments || !departments.length) {
                return res.status(404).json({ message: "No departments found" })
            } res.status(200).json({ departments: departments });
        })
        .catch(err => next(err));
}


module.exports.createDepartment = (req, res, next) => {
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

    Department.create({ ...body })
        .then(department => {
            res.json({ department: department });
        })
        .catch(err => {
            next(err)
        });
}
