var express = require('express');
var router = express.Router();

var utils = require('../utils');

const menuData = require('../models/menuData');
const Order = require('../models/order');

// Define a variable to store the order data
var orderData = [];

// POST /queue endpoint to receive the order data and add it to the order queue
router.post('/queue', function (req, res) {
    var order = req.body.order;
    orderQueue.push(order);
    res.sendStatus(200);
});

router.get('/:id', utils.asyncHandler(async function (req, res, next) {
    const order = new Order(req.params.id);
    if (await order.load()) {
        res.status(200).render('order', { orderItems: await order.getItems(), menuItems: Object.fromEntries((await menuData.getAllMenuItems()).map(item => [item.id, item])) }); // Pass the orderData to the order.ejs template
    } else {
        next(); // Let it 404
    }
}));

// Add a new route to receive the order data and store it in the orderData variable
router.post('/data', function (req, res) {
    orderData = req.body.order;
    res.sendStatus(200);
});

module.exports = router;
