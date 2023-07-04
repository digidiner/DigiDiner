const express = require('express');
const router = express.Router();
const databaseController = require('./controllers/databaseController.js');

router.get('/', (req, res) => {
    const total = req.query.total; // Retrieve the total cost from the query parameter
    res.render('payment', { total });
});

router.post('/', (req, res) => {
    const { fullName, cardNumber, cvv, expiration, zipCode } = req.body;

    // Insert the payment details into the database
    const query = 'INSERT INTO payments (full_name, card_number, cvv, expiration, zip_code) VALUES (?, ?, ?, ?, ?)';
    const values = [fullName, cardNumber, cvv, expiration, zipCode];

    databaseController.getConnection()
        .then(connection => {
            connection.query(query, values)
                .then(results => {
                    connection.release(); // Release the connection back to the pool
                    // Payment successful, redirect to the receipt page
                    res.redirect('/receipt');
                })
                .catch(error => {
                    connection.release(); // Release the connection back to the pool
                    console.error('Error processing payment:', error);
                    // Handle the error and return an appropriate response
                    res.sendStatus(500);
                });
        })
        .catch(error => {
            console.error('Error establishing database connection:', error);
            // Handle the error and return an appropriate response
            res.sendStatus(500);
        });
});

module.exports = router;
