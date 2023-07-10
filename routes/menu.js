var express = require('express');
var router = express.Router();

/* const menuItems = [
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
]; */
// const dinnerItems = [
//     {
//         name: 'Item 1',
//         price: 9.99,
//         modifications: [
//             { name: 'Modification 1', price: 1.99 },
//             { name: 'Modification 2', price: 2.99 }
//         ]
//     },
//     {
//         name: 'Item 2',
//         price: 12.99,
//         modifications: [
//             { name: 'Modification 3', price: 1.49 },
//             { name: 'Modification 4', price: 2.49 },
//             { name: 'Modification 5', price: 0.99 }
//         ]
//     },
// ];
// const drinkItems = [
//     {
//         name: 'Item 1',
//         price: 9.99,
//         modifications: [
//             { name: 'Modification 1', price: 1.99 },
//             { name: 'Modification 2', price: 2.99 }
//         ]
//     },
//     {
//         name: 'Item 2',
//         price: 12.99,
//         modifications: [
//             { name: 'Modification 3', price: 1.49 },
//             { name: 'Modification 4', price: 2.49 },
//             { name: 'Modification 5', price: 0.99 }
//         ]
//     },
// ];

/* GET menu listing. */
// router.get('/', function (req, res) {
//     res.status(200).render('menu', { lunchItems, dinnerItems, drinkItems });
// });

router.get('/', function (req, res) {
    res.status(200).render('menu');
});

module.exports = router;
