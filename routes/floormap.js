var express = require('express');
var router = express.Router();
var utils = require('../utils');
const Waitstaff = require('./api/waitstaff');
const Management = require('./api/management');
const Employee = require('../models/employee')
const Table = require('../models/table');

router.get('/', utils.asyncHandler(async function (req, res) {
    const employeeId = req.session.employeeId;
    // Fetch the employee data (including position) based on the ID
    const employee = await Employee.findById(employeeId);

    res.render('floormap', {
        employee: employee,
        Waitstaff,
        Management,
        Table,
        Employee
    });
}));

module.exports = router;
