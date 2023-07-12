var express = require('express');
var router = express.Router();
var Employee = require('../models/employee')
const databaseController = require('../controllers/databaseController.js');

/* GET home page. */
router.get('/', async function (req, res) {
  res.render('index', { Employee });
});

module.exports = router;