const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors');
const mongoConfig = require('./configs/mongo-config');
// const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/Category');
const departmentsRouter = require('./routes/Department');
const productsRouter = require('./routes/Product');
const blogRouter = require('./routes/Blog');

mongoose.connect(mongoConfig, { autoIndex: true, useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }, function (error) {
  if (error) throw error
  console.log(`connect mongodb success`);
});

const app = express();

// app.use(cors());

app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//set static dir
app.use(express.static(path.join(__dirname, 'public')));

//routers
app.use('/categories', categoriesRouter);
app.use('/departments', departmentsRouter);
app.use('/products', productsRouter);
app.use('/blog', blogRouter);
app.use('/users', usersRouter);
app.use('/public', express.static('public'));
app.use('/', (_, res, __) => {
  res.json({ message: "Up and running" });
});

// catch 404 and forward to error handler
app.use(function (_, __, next) {
  next(createError(404));
});

// error handler
app.use(function (err, _, res, __) {
  console.log(err);
  res.status(err.status || 500).json({ message: err.toString(), });
});

module.exports = app;
