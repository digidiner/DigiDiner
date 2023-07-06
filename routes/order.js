var express = require('express');
var router = express.Router();

// Define a variable to store the order data
var orderData = [];

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
