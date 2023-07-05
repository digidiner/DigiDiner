var express = require('express');
var router = express.Router();

// Define a variable to store the cart data
var cartData = [];

// POST /queue endpoint to receive the cart data and add it to the order queue
router.post('/queue', function (req, res) {
    var cart = req.body.cart;
    orderQueue.push(cart);
    res.sendStatus(200);
});

router.get('/', function (req, res) {
    res.status(200).render('cart', { cart: cartData }); // Pass the cartData to the cart.ejs template
});

// Add a new route to receive the cart data and store it in the cartData variable
router.post('/data', function (req, res) {
    cartData = req.body.cart;
    res.sendStatus(200);
});

module.exports = router;
