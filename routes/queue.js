var express = require('express');
var router = express.Router();

// Order queue array
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
];

// Used to verify user is signed in
function requireSession(req, res, next) {
    if (!req.employee) {
        res.redirect('/');
        return;
    }
    next();
}

// POST /clearItem endpoint
router.post('/clearItem', requireSession, (req, res) => {
    const { orderIndex, itemId } = req.body;

    // Check if the order index is valid
    if (orderIndex >= 0 && orderIndex < orderQueue.length) {
        const order = orderQueue[orderIndex];

        // Find the item by ID in the order
        const itemIndex = order.items.findIndex(item => item.id === itemId);

        // Check if the item exists
        if (itemIndex !== -1) {
            // Remove the item from the order
            order.items.splice(itemIndex, 1);

            // Check if the order is empty after removing the item
            if (order.items.length === 0) {
                // Remove the order from the queue
                orderQueue.splice(orderIndex, 1);
            }

            res.sendStatus(200);
        } else {
            res.sendStatus(404); // Item not found
        }
    } else {
        res.sendStatus(400); // Invalid order index
    }
});

/* GET queue page */
router.get('/', function (req, res) {
    res.status(200).render('queue', { orderQueue });
});

module.exports = router;
