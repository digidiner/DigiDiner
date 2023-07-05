var express = require('express');
var router = express.Router();

var utils = require('../../utils');
var Table = require('../../models/table');

// Used to verify user is signed in and a waitstaff
function requireSession(req, res, next) {
    if (!req.employee) {
        res.status(403).json({
            'error': "Not Signed In"
        });
        return;
    }
    if (!req.employee.position.includes("waitstaff") && !req.employee.position.includes("manager")) {
        res.status(403).json({
            'error': "Not Authorized"
        });
        return;
    }
    next();
}

/* GET table */
router.get('/table', requireSession, utils.asyncHandler(async function(req, res) {
    if (!req.body.id) {
        res.status(400).json({
            'error': "Missing Required Fields"
        });
        return;
    }
    let table = await Table.getTable(req.body.id);
    res.status(200).json({
        'id': table.id,
        'seats': table.seats,
        'posX': table.posX,
        'posY': table.posY,
        'status': table.status
    });
}));

/* PUT table */
router.put('/table', requireSession, utils.asyncHandler(async function(req, res) {
    if (!req.body.id) {
        res.status(400).json({
            'error': "Missing Required Fields"
        });
        return;
    }
    let table = await Table.getTable(req.body.id);
    if (req.body.status) table.status = req.body.status;
    await table.save();
    res.status(200).json({
        'id': table.id,
        'seats': table.seats,
        'posX': table.posX,
        'posY': table.posY,
        'status': table.status
    });
}));

/* GET table list */
router.get('/table/list', requireSession, utils.asyncHandler(async function(req, res) {
    res.status(200).json((await Table.listTables()).map(table => ({
        'id': table.id,
        'seats': table.seats,
        'posX': table.posX,
        'posY': table.posY,
        'status': table.status
    })));
}));

module.exports = router;
