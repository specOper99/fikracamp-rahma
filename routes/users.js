const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../modules/ensureAuthenticated')

const userController = require('../controllers/User');
const cartController = require('../controllers/Cart');


//POST /signin
router.post('/signin', userController.signIn);

//POST /login
router.post('/login', userController.login)

//GET cart
router.get('/:userId/cart', ensureAuthenticated, cartController.getCart)

//POST cart
router.post('/:userId/cart', ensureAuthenticated, cartController.createCart)

//PUT cart
router.put('/:userId/cart', ensureAuthenticated, cartController.updateCart)

module.exports = router;