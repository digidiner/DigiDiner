var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  await require('../controllers/databaseController.js').ping()
    .then(() => {
      res.locals.dbStatus = 'Connected';
      res.render('index');
  	})
  	.catch(err => {
      res.locals.dbStatus = 'Disconnected';
      res.locals.error = err;
      res.render('index');
  	});
});

module.exports = router;
