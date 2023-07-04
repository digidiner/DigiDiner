const express = require('express');
const router = express.Router();
const Payment = require('../../models/payment');

router.get('/', Payment.renderReceipt);

router.post('/', Payment.processPayment);

module.exports = router;