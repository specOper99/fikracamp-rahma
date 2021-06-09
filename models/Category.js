// Object modelling for category. This model will represent in the database and
// we will read the all the information according to this model.
// You can think that this is a representation of the database and we are using that
// for saving, reading, updating information from the database.

const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    }
});

const Category = mongoose.model('Categories-Rahma', categorySchema);


module.exports = Category;