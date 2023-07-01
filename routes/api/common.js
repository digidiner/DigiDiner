const saltRounds = 10;

var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();

var utils = require('../../utils');
var employee = require('../../models/employee');

/* POST new employee signup */
router.post('/employee/signup', utils.asyncHandler(async function(req, res) {
    if (!req.id || !req.nameFirst || !req.nameLast) {
        res.status(400).json({
            'error': "Missing Required Fields"
        });
        return;
    }
    let newEmployee = new employee(req.id);
    if (!(await newEmployee.load()) || newEmployee.nameFirst) {
        res.status(403).json({
            'error': "Invalid Employee ID"
        });
        return;
    }
    newEmployee.passHash = req.pass ? await bcrypt.hash(req.pass, saltRounds) : null;
    newEmployee.nameFirst = req.nameFirst;
    newEmployee.nameLast = req.nameLast;
    await newEmployee.save();
    res.status(201).json({
        'id': newEmployee.id
    });
}));

module.exports = router;
