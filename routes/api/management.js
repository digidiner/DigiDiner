var express = require('express');
var router = express.Router();

var utils = require('../../utils');
var Employee = require('../../models/employee');
var Table = require('../../models/table');

// Used to verify user is signed in and a manager
function requireSession(req, res, next) {
    if (!req.employee) {
        res.status(403).json({
            'error': "Not Signed In"
        });
        return;
    }
    if (!req.employee.position.includes("manager")) {
        res.status(403).json({
            'error': "Not Authorized"
        });
        return;
    }
    next();
}

/* GET employee list */
router.get('/employee/list', requireSession, utils.asyncHandler(async function(req, res) {
    let employeeList = await Employee.listEmployees();
    res.status(200).json({
        'list': employeeList
    });
}));

/* POST create new employee */
router.post('/employee/create', requireSession, utils.asyncHandler(async function(req, res) {
    let id;
    let newEmployee;
    do {
        id = Math.floor(Math.random() * 2147483647);
        newEmployee = new Employee(id);
    } while (await newEmployee.load());
    await newEmployee.save();
    res.status(201).json({
        'id': newEmployee.id
    });
}));

/* POST new table */
router.post('/table', requireSession, utils.asyncHandler(async function(req, res) {
    if (!req.body.id || !req.body.seats) {
        res.status(400).json({
            'error': "Missing Required Fields"
        });
        return;
    }
    let table = await Table.addTable(req.body.id, req.body.seats, req.body.posX, req.body.posY);
    res.status(201).json({
        'id': table.id,
        'seats': table.seats,
        'posX': table.posX,
        'posY': table.posY,
        'status': table.status
    });
}));

module.exports = router;
