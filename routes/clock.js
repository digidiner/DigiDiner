var express = require('express');
var router = express.Router();
var utils = require('../utils');

const TimeClock = require('../models/timeclock');
const Employee = require('../models/employee');

// GET /clock/:employeeId - Display the time clock for a specific employee
router.get('/:id', utils.asyncHandler(async function (req, res) {
    var employeeId = req.params.id;
    // Retrieve the employee data based on the employeeId
    try {
        // Fetch the employee details
        var employee = await Employee.findById(employeeId);
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