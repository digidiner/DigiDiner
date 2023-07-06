var express = require('express');
var router = express.Router();

/*const employee = {
    name: "John Doe",
    id: "EMP001",
};

const status = "Clocked In";

const clockInRecords = [
    "2023-06-26 08:00:00",
    "2023-06-27 07:45:00",
];

const clockOutRecords = [
    "2023-06-26 16:30:00",
    "2023-06-27 17:15:00",
];

const punches = [...clockInRecords, ...clockOutRecords];

 GET clock listing. 
router.get('/', function (req, res) {
    res.status(200).render('clock', { employee, status, punches });
});*/


const TimeClock = require('../models/timeclock');
const Employee = require('../models/employee');

// GET /clock/:employeeId - Display the time clock for a specific employee
router.get('/:employeeId', async (req, res) => {
    const employeeId = req.params.employeeId;
    try {
        // Fetch the employee details
        const employee = await Employee.getEmployee(employeeId);

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

        res.render('clock', { employee, status, punches });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// POST /clock/:employeeId/clock-in - Clock in for a specific employee
router.post('/:employeeId/clock-in', async (req, res) => {
    const employeeId = req.params.employeeId;
    try {
        // Fetch the employee details
        const employee = await Employee.getEmployee(employeeId);

        if (!employee) {
            // Employee not found
            return res.status(404).send('Employee not found');
        }

        // Create a TimeClock instance for the employee
        const timeClock = new TimeClock(employeeId);

        // Clock in for the employee
        const activePeriod = await timeClock.clockIn();
        const status = activePeriod ? 'Clocked In' : 'Clocked Out';

        // Redirect to the clock page
        res.redirect(`/clock/${employeeId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// POST /clock/:employeeId/clock-out - Clock out for a specific employee
router.post('/:employeeId/clock-out', async (req, res) => {
    const employeeId = req.params.employeeId;
    try {
        // Fetch the employee details
        const employee = await Employee.getEmployee(employeeId);

        if (!employee) {
            // Employee not found
            return res.status(404).send('Employee not found');
        }

        // Create a TimeClock instance for the employee
        const timeClock = new TimeClock(employeeId);

        // Clock out for the employee
        const activePeriod = await timeClock.clockOut();
        const status = activePeriod ? 'Clocked In' : 'Clocked Out';

        // Redirect to the clock page
        res.redirect(`/clock/${employeeId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;