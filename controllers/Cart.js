const Cart = require('../models/Cart');
const CartClass = require('../modules/Cart');
const Product = require('../models/Product');
const TypedError = require('../modules/ErrorHandler');

module.exports.createCart = (req, res, next) => {
    let userId = req.params.userId
    let { productId, increase, decrease } = req.body

    Cart.getCartByUserId(userId, function (err, c) {
        if (err) return next(err)
        let oldCart = new CartClass(c[0] || { userId })
        // no cart save empty cart to database then return response
        if (c.length < 1 && !productId) {
            return Cart.createCart(oldCart.generateModel(), function (err, resultCart) {
                if (err) return next(err)
                return res.status(201).json({ cart: resultCart })
            })
        }
        Product.findById(productId, function (e, product) {
            if (e) {
                e.status = 406;
                return next(e);
            }
            if (product) {
                if (decrease) {
                    oldCart.decreaseQty(product.id);
                } else if (increase) {
                    oldCart.increaseQty(product.id);
                } else {
                    oldCart.add(product, product.id);
                }
                let newCart = oldCart.generateModel()
                Cart.updateCartByUserId(
                    userId,
                    newCart,
                    function (err, result) {
                        if (err) return next(err)
                        return res.status(200).json({ cart: result })
                    })
            } else {
                let err = new TypedError('/cart', 400, 'invalid_field', {
                    message: "invalid request body"
                })
                return next(err)
            }
        })
    })
}

module.exports.getCart = (req, res, next) => {
    let userId = req.params.userId
    Cart.getCartByUserId(userId, function (err, cart) {
        if (err) return next(err)
        if (cart.length < 1) {
            let err = new TypedError('cart error', 404, 'not_found', { message: "create a cart first" })
            return next(err)
        }
        return res.json({ cart: cart[0] })
    })
}

module.exports.updateCart = (req, res, next) => {
    let userId = req.params.userId
    let requestProduct = req.body
    let { productId, color, size } = requestProduct.product

    Cart.getCartByUserId(userId, function (err, c) {
        if (err) return next(err)
        let oldCart = new CartClass(c[0] || {})
        Product.getProductByID(productId, function (err, p) {
            if (err) return next(err)
            let newCart = oldCart.add(p, productId, { color, size })

            //exist cart in database
            if (c.length > 0) {
                Cart.updateCartByUserId(
                    userId,
                    {
                        items: newCart.items,
                        totalQty: newCart.totalQty,
                        totalPrice: newCart.totalPrice,
                        userId: userId
                    },
                    function (err, result) {
                        if (err) return next(err)
                        res.json(result)
                    })
            } else {
                //no cart in database
                newCart = new Cart({
                    items: newCart.items,
                    totalQty: newCart.totalQty,
                    totalPrice: newCart.totalPrice,
                    userId: userId
                })
                Cart.createCart(newCart, function (err, resultCart) {
                    if (err) return next(err)
                    res.status(201).json(resultCart)
                })
            }
        })
    })
}