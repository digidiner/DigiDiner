var express = require('express');
var router = express.Router();

// Dummy table data
const tables = [
    { id: 1, status: 'dirty' },
    { id: 2, status: 'occupied' },
    { id: 3, status: 'unoccupied' },
    { id: 4, status: 'occupied' },
    { id: 5, status: 'unoccupied' },
    { id: 6, status: 'dirty' },
    { id: 7, status: 'unoccupied' },
    { id: 8, status: 'unoccupied' },
    { id: 9, status: 'dirty' },
];

const menuItems = [
    {
        name: 'Item 1',
        price: 9.99,
        modifications: [
            { name: 'Modification 1', price: 1.99 },
            { name: 'Modification 2', price: 2.99 }
        ]
    },
    {
        name: 'Item 2',
        price: 12.99,
        modifications: [
            { name: 'Modification 3', price: 1.49 },
            { name: 'Modification 4', price: 2.49 },
            { name: 'Modification 5', price: 0.99 }
        ]
    }
];

// GET the floor map
router.get('/', function (req, res) {
    res.status(200).render('floormap', { tables });
});

module.exports = router;
