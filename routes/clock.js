var express = require('express');
var router = express.Router();

const employee = {
    name: "John Doe",
    id: "EMP001",
};

const clockInRecords = [
    { timestamp: "2023-06-26 08:00:00" },
    { timestamp: "2023-06-27 07:45:00" },
];

const clockOutRecords = [
    { timestamp: "2023-06-26 16:30:00" },
    { timestamp: "2023-06-27 17:15:00" },
];


/* GET clock listing. */
router.get('/', function (req, res) {
    res.status(200).render('clock', { employee, clockInRecords, clockOutRecords });
});

module.exports = router;