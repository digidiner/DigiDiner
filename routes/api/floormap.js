var express = require('express');
var router = express.Router();
const Table = require('../../models/table');

// Dummy menu data

const lunchItems = [
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
    },
];
const dinnerItems = [
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
    },
];
const drinkItems = [
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
    },
];


// GET the floor map

router.get('/', async function (req, res) {
    try {
        const tables = await Table.listTables();
        res.render('floormap', { tables, lunchItems, dinnerItems, drinkItems });
    } catch (error) {
        // Handle the error appropriately
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
