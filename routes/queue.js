var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
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
        const response = await fetch('/api/kitchen/order/list');
        if (!response.ok) {
            throw new Error('Failed to fetch submitted orders');
        }
        const submittedOrders = await response.json();

        res.status(200).render('queue', { orderQueue: submittedOrders });
    } catch (error) {
        console.error('Error occurred while fetching orders:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
