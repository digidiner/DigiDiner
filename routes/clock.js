var express = require('express');
var router = express.Router();
var utils = require('../utils');

const TimeClock = require('../models/timeclock');
const Employee = require('../models/employee');

// GET /clock/:employeeId - Display the time clock for a specific employee
router.get('/:id', utils.asyncHandler(async function (req, res) {
    const employeeId = req.params.id;
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

// POST /clock/:id/clockin - Clock in the employee
router.post('/:id/clockin', requireSession, async (req, res) => {
    try {
        const employeeId = req.params.id;
        const response = await fetch(`/api/common/employee/clockin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ employeeId }),
        });

        if (response.ok) {
            const data = await response.json();
            res.status(200).json({ message: 'Clock In Successful' });
        } else {
            const errorData = await response.json();
            res.status(400).json({ message: 'Clock In Failed', reason: errorData.reason });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// POST /clock/:id/clockout - Clock out the employee
router.post('/:id/clockout', requireSession, async (req, res) => {
    try {
        const employeeId = req.params.id;
        const response = await fetch(`/api/common/employee/clockout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ employeeId }),
        });

        if (response.ok) {
            const data = await response.json();
            res.status(200).json({ message: 'Clock Out Successful' });
        } else {
            const errorData = await response.json();
            res.status(400).json({ message: 'Clock Out Failed', reason: errorData.reason });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;