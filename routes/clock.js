var express = require('express');
var router = express.Router();
var utils = require('../utils');

const TimeClock = require('../models/timeclock');
const Employee = require('../models/employee');

// GET /clock/:employeeId - Display the time clock for a specific employee
router.get('/', utils.asyncHandler(async function (req, res) {
    /*const employeeId = req.params.employeeId;
    try {
        // Fetch the employee details
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            // Employee not found
            return res.status(404).send('Employee not found');
        }
        // Create a TimeClock instance for the employee
        const timeClock = new TimeClock(employeeId); 
        // Get the current status
const activePeriod = await req.employee.timeClock.getActivePeriod();
const status = activePeriod ? 'Clocked In' : 'Clocked Out';

// Get the timestamp punches (need to replace with method)
const punches = [];

res.render('clock', { status, punches });
    } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
}
}));*/
    try {
        // Retrieve the employee's time clock
        const employeeId = req.session.employeeId;
        const timeClock = new TimeClock(employeeId);

        // Get the current status
        const activePeriod = await timeClock.getActivePeriod();
        const status = activePeriod ? 'Clocked In' : 'Clocked Out';

        // Get the total time
        const totalTime = await timeClock.getTotalTime();

        // Get the list of periods
        const periods = await timeClock.listPeriods();

        res.render('clock', { employee: req.employee, status, totalTime, periods });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}));

module.exports = router;