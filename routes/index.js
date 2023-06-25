var express = require('express');
var router = express.Router();

var dbConnection;

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    if (!dbConnection) dbConnection = await require('../controllers/databaseController.js').getConnection();
    await dbConnection.ping();
    res.locals.dbStatus = 'Connected';
  } catch (err) {
    res.locals.dbStatus = 'Disconnected';
    res.locals.error = err;
  }
  res.render('index');
});

module.exports = router;
