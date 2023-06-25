var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    await require('../controllers/databaseController.js').getConnection().ping()
    res.locals.dbStatus = 'Connected';
  } catch (err) {
    res.locals.dbStatus = 'Disconnected';
    res.locals.error = err;
  }
  res.render('index');
});

module.exports = router;
