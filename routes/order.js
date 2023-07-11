var express = require('express');
var router = express.Router();

const Order = require('../models/order');

// Define a variable to store the order data
var orderData = [
    {
        name: "Burger",
        count: 2,
        price: 10.99
    },
    {
        name: "Pizza",
        count: 1,
        price: 12.99
    },
    {
        name: "Salad",
        count: 1,
        price: 8.99
    }
];

// POST /queue endpoint to receive the order data and add it to the order queue
router.post('/queue', function (req, res) {
    var order = req.body.order;
    orderQueue.push(order);
    res.sendStatus(200);
});

router.get('/', function (req, res) {
    res.status(200).render('order', { order: orderData }); // Pass the orderData to the order.ejs template
});

// Add a new route to receive the order data and store it in the orderData variable
router.post('/data', function (req, res) {
    orderData = req.body.order;
    res.sendStatus(200);
});

module.exports = router;
