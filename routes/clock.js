var express = require('express');
var router = express.Router();
var utils = require('../utils');

const TimeClock = require('../models/timeclock');
const Employee = require('../models/employee');

// Used to verify user is signed in
function requireSession(req, res, next) {
    if (!req.employee) {
        res.redirect('/');
        return;
    }
    next();
}

// GET /clock for an employee
router.get('/', requireSession, utils.asyncHandler(async function (req, res) {
    // Create a TimeClock instance for the employee
    const timeClock = new TimeClock(req.employee.id);

    // Get the current status
    const activePeriod = await timeClock.getActivePeriod();
    const status = activePeriod ? 'Clocked In' : 'Clocked Out';

    // Get the timestamp punches (need to replace with method)
    const punches = [];

    // Get the total time and list of periods
    const totalTime = await timeClock.getTotalTime();
    const periods = await timeClock.listPeriods();

    res.render('clock', { employee: req.employee, status, totalTime, periods, punches });
}));

module.exports = router;