var express = require('express');
var router = express.Router();
var Order = require('../models/order');

// Used to verify user is signed in
function requireSession(req, res, next) {
    if (!req.employee) {
        req.session.returnTo = req.originalUrl;
        res.redirect('/');
        return;
    }
    next();
}

/* GET queue page */
router.get('/', requireSession, async function (req, res) {
    try {
        const orders = await Order.listOrders();
        const submittedOrders = orders.filter(order => order.status === 'submitted');
        res.status(200).render('queue', { orderQueue: submittedOrders });
    } catch (error) {
        console.error('Error occurred while fetching orders:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
