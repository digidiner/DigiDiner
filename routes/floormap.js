var express = require('express');
var router = express.Router();
var utils = require('../utils');
const Waitstaff = require('./api/waitstaff');
const Management = require('./api/management');

router.get('/', utils.asyncHandler(async function (req, res) {
    try {
        const tables = await Waitstaff.listTables();
        res.render('floormap', { tables, lunchItems, dinnerItems, drinkItems, /* employee: req.employee */ });
    } catch (error) {
        // Handle the error appropriately
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}));

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





/* // GET /tables/:id - Get a specific table
router.get('/:id', async (req, res) => {
    const tableId = req.params.id;
    try {
        const table = await Table.getTable(tableId);
        if (table) {
            res.status(200).json(table);
        } else {
            res.status(404).json({ message: 'Table not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// POST /tables - Add a new table
router.post('/', async (req, res) => {
    const { seats, posX, posY, status } = req.body;
    try {
        const newTable = await Table.addTable(seats, posX, posY, status);
        res.status(201).json(newTable);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// DELETE /tables/:id - Remove a table
router.delete('/:id', async (req, res) => {
    const tableId = req.params.id;
    try {
        const success = await Table.removeTable(tableId);
        if (success) {
            res.status(200).json({ message: 'Table deleted successfully' });
        } else {
            res.status(404).json({ message: 'Table not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// PUT /tables/:id - Update a table
router.put('/:id', async (req, res) => {
    const tableId = req.params.id;
    const { seats, posX, posY, status } = req.body;
    try {
        const table = await Table.getTable(tableId);
        if (table) {
            table.seats = seats || table.seats;
            table.posX = posX || table.posX;
            table.posY = posY || table.posY;
            table.status = status || table.status;
            await table.save();
            res.status(200).json(table);
        } else {
            res.status(404).json({ message: 'Table not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}); */

module.exports = router;
