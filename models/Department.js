// Object modelling for department. This model will represent in the database and
// we will read the all the information according to this model.
// You can think that this is a representation of the database and we are using that
// for saving, reading, updating information from the database.

const mongoose = require('mongoose');

const departmentSchema = mongoose.Schema({
    departmentName: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    categories: {
        type: String,
        trim: true,
        required: true,
    }
});

const Department = mongoose.model('Department-Rahma', departmentSchema);


module.exports = Department;