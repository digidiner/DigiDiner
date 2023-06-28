var express = require('express');
var router = express.Router();

var employee = require('../../models/employee');

/* GET users listing. */
router.get('/employee/list', async function(req, res) {
    let employeeList = await employee.listEmployees();
    res.status(200).send({
        'response': employeeList
    });
});

module.exports = router;
