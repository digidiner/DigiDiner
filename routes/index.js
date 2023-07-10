var express = require('express');
var router = express.Router();
var Employee = require('../models/employee')
const databaseController = require('../controllers/databaseController.js');

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    if (!databaseController.dbConnection) {
      databaseController.dbConnection = await databaseController.getConnection();
    }
    await databaseController.dbConnection.ping();
    res.locals.dbStatus = 'Connected';
  } catch (err) {
    res.locals.dbStatus = 'Disconnected';
    res.locals.error = err;
  }
  res.render('index', { Employee });
});

module.exports = router;