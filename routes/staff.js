var express = require('express');
var router = express.Router();

const user = {
  firstName: 'John',
  lastName: 'Doe',
  id: 123,
  position: 'Software Engineer',
  timestamp: new Date().toISOString()
};

/* GET users listing. */
router.get('/', function (req, res) {
  res.status(200).render('staff', { user });
});

module.exports = router;
