var express = require('express');
var router = express.Router();

var utils = require('../utils');

const menuData = require('../models/menuData');
const Order = require('../models/order');

router.get('/:id', utils.asyncHandler(async function (req, res, next) {
    const order = new Order(req.params.id);
    if (await order.load()) {
        if (order.status == 'new') {
            order.status = 'incomplete';
            await order.save();
        }
        let orderItems = await order.getItems();
        res.status(200).render('bill', { subtotal: calculateSubtotal(orderItems), taxes: calculateTaxes(orderItems), total: calculateTotal(orderItems, 0), order: order, orderItems: orderItems, menuItems: Object.fromEntries((await menuData.getAllMenuItems()).map(item => [item.id, item])) }); // Pass the orderData to the order.ejs template
    } else {
        next(); // Let it 404
    }
}));

function calculateSubtotal(orderItems) {
    var subtotal = 0;
    orderItems.forEach(function (item) {
        subtotal += item.quantity * item.price;
    });
    return subtotal.toFixed(2);
}

function calculateTaxes(orderItems) {
    var subtotal = calculateSubtotal(orderItems);
    var taxes = subtotal * 0.1; // Assuming tax rate of 10%
    return taxes.toFixed(2);
}

function calculateTotal(orderItems, tip) {
    var subtotal = calculateSubtotal(orderItems);
    var taxes = calculateTaxes(orderItems);
    var total = parseFloat(subtotal) + parseFloat(taxes) + parseFloat(tip);
    return total.toFixed(2);
}

module.exports = router;
