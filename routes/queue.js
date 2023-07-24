var express = require('express');
var router = express.Router();
var Queue = require('./api/kitchen');
var Order = require('../models/order');
var menuItemOption = require('../models/menuItemOption');

/* // Order queue array
const orderQueue = [
    {
        items: [
            {
                quantity: 2,
                name: "Burger",
                modifications: "No onions",
                allergies: "None",
                id: "item1"
            },
            {
                quantity: 1,
                name: "Pizza",
                modifications: "Extra cheese",
                allergies: "Gluten",
                id: "item2"
            }
        ]
    },
    {
        items: [
            {
                quantity: 3,
                name: "Salad",
                modifications: "No tomatoes",
                allergies: "None",
                id: "item3"
            }
        ]
    }
]; */

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
