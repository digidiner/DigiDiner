var express = require('express');
var router = express.Router();
var Employee = require('../models/employee');

/* GET profile page for the currently signed-in employee. */
router.get('/', async function (req, res) {
  try {
    const employeeId = req.session.employeeId; // Assuming the employee ID is stored in the session
    // Retrieve the employee data based on the employeeId
    const employee = await Employee.findById(employeeId);
    if (employee) {
      res.status(200).render('profile', { employee });
    } else {
      res.status(404).send('Employee not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;