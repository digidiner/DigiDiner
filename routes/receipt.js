const express = require('express');
const router = express.Router();
const databaseController = require('./controllers/databaseController.js');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'YourEmailService',
    auth: {
        user: 'YourEmail',
        pass: 'YourEmailPassword'
    }
});

// Create a Twilio client
const twilioClient = twilio('YourTwilioAccountSid', 'YourTwilioAuthToken');

router.get('/', (req, res) => {
    const total = req.query.total; // Retrieve the total cost from the query parameter
    res.render('receipt', { total });
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
                    // Payment successful, render the receipt page
                    const timestamp = new Date().toLocaleString();
                    const maskedCardNumber = maskCardNumber(cardNumber);
                    res.render('receipt', { timestamp, fullName, maskedCardNumber, cvv, expiration, zipCode });
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

function maskCardNumber(cardNumber) {
    const lastFourDigits = cardNumber.slice(-4);
    return '*'.repeat(cardNumber.length - 4) + lastFourDigits;
}

function sendEmailReceipt(email) {
    const mailOptions = {
        from: 'YourEmailAddress',
        to: email,
        subject: 'Receipt',
        text: 'Here is your receipt.'
        // You can add more details to the email content or attach a PDF receipt if desired
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

function sendTextReceipt(phoneNumber) {
    const message = 'Here is your receipt.';

    twilioClient.messages
        .create({
            body: message,
            from: 'YourTwilioPhoneNumber',
            to: phoneNumber
        })
        .then(message => console.log('Text message sent:', message.sid))
        .catch(error => console.error('Error sending text message:', error));
}

module.exports = router;
