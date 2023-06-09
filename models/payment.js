const nodemailer = require('nodemailer');
const twilio = require('twilio');

class Payment {
    static async connectDatabase(conn) {
        this.conn = conn;
        const query = `CREATE TABLE IF NOT EXISTS payment (
            id INT PRIMARY KEY AUTO_INCREMENT,
            full_name VARCHAR(100) NOT NULL,
            card_number VARCHAR(16) NOT NULL,
            cvv VARCHAR(3) NOT NULL,
            expiration VARCHAR(7) NOT NULL,
            zip_code VARCHAR(10) NOT NULL
        )`;
    }

    static async insertPayment(fullName, cardNumber, cvv, expiration, zipCode) {
        const query = 'INSERT INTO payment (full_name, card_number, cvv, expiration, zip_code) VALUES (?, ?, ?, ?, ?)';
        const values = [fullName, cardNumber, cvv, expiration, zipCode];
        return await this.conn.query(query, values);
    }

    static calculateSubtotal(order) {
        let subtotal = 0;
        order.forEach((item) => {
            subtotal += item.quantity * item.price;
        });
        return subtotal.toFixed(2);
    }

    static calculateTaxes(order) {
        const subtotal = this.calculateSubtotal(order);
        const taxes = subtotal * 0.1; // Assuming tax rate of 10%
        return taxes.toFixed(2);
    }

    static calculateTotal(order, tip) {
        const subtotal = this.calculateSubtotal(order);
        const taxes = this.calculateTaxes(order);
        const total = parseFloat(subtotal) + parseFloat(taxes) + parseFloat(tip);
        return total.toFixed(2);
    }

    static async processPayment(req, res) {
        const { fullName, cardNumber, cvv, expiration, zipCode } = req.body;

        try {
            const results = await this.insertPayment(fullName, cardNumber, cvv, expiration, zipCode);

            const orderResponse = await import('node-fetch').then(({ default: fetch }) => fetch('http://digidiner.net/order/data'));
            const orderData = await orderResponse.json();
            const order = orderData.order;

            const tip = req.body.tip; // Retrieve the tip amount from the request body

            res.render('bill', {
                order,
                subtotal: this.calculateSubtotal(order),
                taxes: this.calculateTaxes(order),
                total: this.calculateTotal(order, tip),
            });
        } catch (error) {
            console.error('Error processing payment:', error);
            // Handle the error and return an appropriate response
            res.sendStatus(500);
        }
    }

    static renderReceipt(req, res) {
        const total = req.query.total; // Retrieve the total cost from the query parameter
        res.render('receipt', { total });
    }

    static maskCardNumber(cardNumber) {
        const lastFourDigits = cardNumber.slice(-4);
        return '*'.repeat(cardNumber.length - 4) + lastFourDigits;
    }

    static sendEmailReceipt(email) {
        const transporter = nodemailer.createTransport({
            service: 'YourEmailService',
            auth: {
                user: 'YourEmail',
                pass: 'YourEmailPassword'
            }
        });

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

    static sendTextReceipt(phoneNumber) {
        const twilioClient = twilio('YourTwilioAccountSid', 'YourTwilioAuthToken');
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
}

module.exports = Payment;
