var express = require('express');
var router = express.Router();

const menuItems = [
    { name: 'Item 1', description: 'Description 1', price: 9.99, image: '#' },
    { name: 'Item 2', description: 'Description 2', price: 8.99, image: '#' },
    // Add more menu items as needed
];

/* GET users listing. */
router.get('/', function (req, res) {
    res.status(200).render('menu', { menuItems });
});

module.exports = router;