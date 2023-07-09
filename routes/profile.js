var express = require('express');
var router = express.Router();
var Employee = require('./api/common');


/* GET users listing. */
router.get('/', function (req, res) {
  res.status(200).render('profile', { Employee });
});

module.exports = router;
