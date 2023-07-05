var express = require('express');
var router = express.Router();

var utils = require('../../utils');
var Employee = require('../../models/employee');

// Used to verify user is signed in and a manager
function requireSession(req, res, next) {
    if (!req.session.employee) {
        res.status(403).json({
            'error': "Not Signed In"
        });
        return;
    } else if (!req.session.employee.position.includes("manager")) {
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

module.exports = router;
