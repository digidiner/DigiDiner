const express = require('express');
const router = express.Router();

// Helper function to calculate the subtotal of the items in the cart
function calculateSubtotal(cart) {
    let subtotal = 0;
    cart.forEach((item) => {
        subtotal += item.quantity * item.price;
    });
    return subtotal.toFixed(2);
}

// Helper function to calculate the taxes based on the subtotal
function calculateTaxes(cart) {
    const subtotal = calculateSubtotal(cart);
    const taxes = subtotal * 0.1; // Assuming tax rate of 10%
    return taxes.toFixed(2);
}

// Helper function to calculate the total cost including taxes and tip
function calculateTotal(cart, tip) {
    const subtotal = calculateSubtotal(cart);
    const taxes = calculateTaxes(cart);
    const total = parseFloat(subtotal) + parseFloat(taxes) + parseFloat(tip);
    return total.toFixed(2);
}

router.get('/', (req, res) => {
    // Retrieve the cart data from wherever it is stored
    const cart = []; // Replace this with the actual code to retrieve the cart data

    res.render('bill', {
        cart,
        calculateSubtotal,
        calculateTaxes,
        calculateTotal,
    });
});

module.exports = router;
