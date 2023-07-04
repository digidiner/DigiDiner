const express = require('express');
const router = express.Router();
const Payment = require('../../models/payment');

router.get('/', (req, res) => {
    const total = req.query.total;
    res.render('payment', { total });
});

router.post('/', (req, res) => {
    const { fullName, cardNumber, cvv, expiration, zipCode } = req.body;

    Payment.insertPayment(fullName, cardNumber, cvv, expiration, zipCode)
        .then(() => {
            res.redirect('/receipt');
        })
        .catch((error) => {
            console.error('Error processing payment:', error);
            res.sendStatus(500);
        });
});

module.exports = router;