const saltRounds = 10;

var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();

var utils = require('../../utils');
var employee = require('../../models/employee');

/* POST new employee signup */
router.post('/employee/signup', utils.asyncHandler(async function(req, res) {
    if (!req.body.id || !req.body.nameFirst || !req.body.nameLast) {
        res.status(400).json({
            'error': "Missing Required Fields"
        });
        return;
    }
    let newEmployee = new employee(req.body.id);
    if (!(await newEmployee.load()) || newEmployee.nameFirst) {
        res.status(403).json({
            'error': "Invalid Employee ID"
        });
        return;
    }
    newEmployee.passHash = req.body.pass ? await bcrypt.hash(req.body.pass, saltRounds) : null;
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

module.exports = router;
