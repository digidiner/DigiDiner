var express = require('express');
var router = express.Router();

var utils = require('../../utils');
var employee = require('../../models/employee');

/* GET employee list */
router.get('/employee/list', utils.asyncHandler(async function(req, res) {
    let employeeList = await employee.listEmployees();
    res.status(200).json({
        'response': employeeList
    });
}));

module.exports = router;
