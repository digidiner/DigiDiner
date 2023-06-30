var express = require('express');
var router = express.Router();

// Define the dummy data
const tables = [
    { id: 1, status: 'dirty' },
    { id: 2, status: 'occupied' },
    { id: 3, status: 'unoccupied' },
    { id: 4, status: 'occupied' },
    { id: 5, status: 'unoccupied' },
    { id: 6, status: 'dirty' },
    { id: 7, status: 'unoccupied' },
];

// GET the floor map
router.get('/', function (req, res) {
    res.status(200).render('floormap', { tables });
});

module.exports = router;
