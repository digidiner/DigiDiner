const express = require('express');
const router = express.Router();
const Payment = require('../../models/payment');
const fetch = require('node-fetch');


router.get('/', async (req, res) => {
    try {
        // Retrieve the cart data from the server
        const cartResponse = await fetch('http://service.digidiner.net/cart');
        const cartData = await cartResponse.json();
        const cart = cartData.cart;

        res.render('bill', {
            cart,
            calculateSubtotal: Payment.calculateSubtotal,
            calculateTaxes: Payment.calculateTaxes,
            calculateTotal: Payment.calculateTotal,
        });
    } catch (error) {
        console.error('Error retrieving cart data:', error);
        // Handle the error and return an appropriate response
        res.sendStatus(500);
    }
});

module.exports = router;
