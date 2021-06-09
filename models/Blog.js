const mongoose = require('mongoose');


const blogSchema = mongoose.Schema({
  image: {
    type: String,
    required: true,
    trim: true,
    get: (val) => {
      return encodeURI(`http://specoper99.fikracamp.com:29999/${val}`);
    },
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
    default: 'No Category',
  },
  date: {
    type: Date,
    default: Date.now,
  }
});


blogSchema.set('toObject', { getters: true });
blogSchema.set('toJSON', { getters: true });


const Blog = mongoose.model('Blog-Mustafa', blogSchema);


module.exports = Blog;
