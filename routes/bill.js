const express = require('express');
const router = express.Router();
const Payment = require('../models/payment');

router.get('/', async (req, res) => {
    // Retrieve the cart data from where it's stored
    const cart = []; // Replace with code to retrieve the cart data

    res.render('bill', {
        cart,
        calculateSubtotal: Payment.calculateSubtotal,
        calculateTaxes: Payment.calculateTaxes,
        calculateTotal: Payment.calculateTotal,
    });
});

module.exports = router;