const express = require('express');
const router = express.Router();
const Payment = require('../../models/payment');

router.get('/', Payment.renderReceipt);

router.post('/', Payment.processPayment);

const timestamp = '2023-07-05';
const fullName = 'John Doe';
const maskedCardNumber = '**** **** **** 1234';
const cvv = '123';
const expiration = '12/25';
const zipCode = '12345';

module.exports = router;