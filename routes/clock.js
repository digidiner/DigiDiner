var express = require('express');
var router = express.Router();
var utils = require('../utils');

const TimeClock = require('../models/timeclock');
const Employee = require('../models/employee');

// GET /clock for an employee
router.get('/', utils.asyncHandler(async function (req, res) {
    // Retrieve the employee data based on the currently signed-in employee
    try {
        // Fetch the employee details
        const employeeId = req.session.employeeId; // Assuming the employee ID is stored in the session
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            // Employee not found
            return res.status(404).send('Employee not found');
        }

        // Create a TimeClock instance for the employee
        const timeClock = new TimeClock(employeeId);

        // Get the current status
        const activePeriod = await timeClock.getActivePeriod();
        const status = activePeriod ? 'Clocked In' : 'Clocked Out';

        // Get the timestamp punches (need to replace with method)
        const punches = [];

        // Get the total time and list of periods
        const totalTime = await timeClock.getTotalTime();
        const periods = await timeClock.listPeriods();

        res.render('clock', { employee, status, totalTime, periods, punches });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}));

module.exports = router;