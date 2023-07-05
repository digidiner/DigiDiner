var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();

var utils = require('../../utils');
var Employee = require('../../models/employee');

// Used to verify user is signed in
function requireSession(req, res, next) {
    if (!req.session.employee) {
        res.status(403).json({
            'error': "Not Signed In"
        });
        return;
    }
    next();
}

/* POST new employee signup */
router.post('/employee/signup', utils.asyncHandler(async function(req, res) {
    if (!req.body.id || !req.body.nameFirst || !req.body.nameLast) {
        res.status(400).json({
            'error': "Missing Required Fields"
        });
        return;
    }
    let newEmployee = new Employee(req.body.id);
    if (!(await newEmployee.load()) || newEmployee.nameFirst) {
        res.status(403).json({
            'error': "Invalid Employee ID"
        });
        return;
    }
    newEmployee.passHash = req.body.pass ? await bcrypt.hash(req.body.pass, Employee.passSaltRounds) : null;
    newEmployee.nameFirst = req.body.nameFirst;
    newEmployee.nameLast = req.body.nameLast;
    await newEmployee.save();
    res.status(201).json({
        'id': newEmployee.id,
        'nameFirst': newEmployee.nameFirst,
        'nameLast': newEmployee.nameLast,
        'hireDate': newEmployee.hireDate,
        'position': newEmployee.position.name
    });
}));

/* POST employee auth */
router.post('/employee/auth', utils.asyncHandler(async function(req, res) {
    if (!req.body.id) {
        res.status(400).json({
            'error': "Missing Required Fields"
        });
        return;
    }
    let employee = new Employee(req.body.id);
    if (!(await employee.load())) {
        res.status(403).json({
            'error': "Invalid Employee ID"
        });
        return;
    } else if (!employee.nameFirst) {
        res.status(403).json({
            'error': "Account Needs Signup"
        });
        return;
    } else if (!employee.auth(req.body.pass)) {
        res.status(403).json({
            'error': "Incorrect Password"
        });
        return;
    }
    req.session.employee = employee;
    res.status(200).json({
        'id': employee.id,
        'nameFirst': employee.nameFirst,
        'nameLast': employee.nameLast,
        'hireDate': employee.hireDate,
        'position': employee.position.name
    });
}));

/* POST employee time clock in */
router.post('/employee/clockin', requireSession, utils.asyncHandler(async function(req, res) {
    let period = await req.session.employee.timeClock.clockIn();
    if (period) {
        res.status(200).json({
            'status': "Success",
            'startTime': period.startTime
        });
    } else {
        res.status(400).json({
            'status': "Failed",
            'reason': "Already Clocked In"
        });
    }
}));

/* POST employee time clock out */
router.post('/employee/clockout', requireSession, utils.asyncHandler(async function(req, res) {
    let period = await req.session.employee.timeClock.clockOut();
    if (period) {
        res.status(200).json({
            'status': "Success",
            'startTime': period.startTime,
            'endTime': period.endTime
        });
    } else {
        res.status(400).json({
            'status': "Failed",
            'reason': "Not Clocked In"
        });
    }
}));

module.exports = router;
