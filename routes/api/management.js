var express = require('express');
var router = express.Router();

var utils = require('../../utils');
var employee = require('../../models/employee');

/* GET employee list */
router.get('/employee/list', utils.asyncHandler(async function(req, res) {
    let employeeList = await employee.listEmployees();
    res.status(200).json({
        'list': employeeList
    });
}));

/* POST create new employee */
router.post('/employee/create', utils.asyncHandler(async function(req, res) {
    let id;
    let newEmployee;
    do {
        id = Math.floor(Math.random() * 2147483647);
        newEmployee = new employee();
    } while (!(await newEmployee.load()));
    await newEmployee.save();
    res.status(201).json({
        'id': newEmployee.id
    });
}));

module.exports = router;
