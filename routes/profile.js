var express = require('express');
var router = express.Router();
var Employee = require('../models/employee');


/* GET profile page. */
router.get('/:id', function (req, res) {
  var employeeId = req.params.id;
  // Retrieve the employee data based on the employeeId
  var employee = Employee.findById(employeeId);
  if (employee) {
    res.status(200).render('profile', { employee });
  } else {
    res.status(404).send('Employee not found');
  }
});

module.exports = router;
