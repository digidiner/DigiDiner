var express = require('express');
var router = express.Router();
var utils = require('../utils');
const nodemailer = require('nodemailer');

const menuData = require('../models/menuData');
const Order = require('../models/order');

router.get('/:id', utils.asyncHandler(async function (req, res, next) {
    const order = new Order(req.params.id);
    if (await order.load()) {
        if (order.status == 'new') {
            order.status = 'incomplete';
            await order.save();
        }
        let orderItems = await order.getItems();
        let menuItems = Object.fromEntries((await menuData.getAllMenuItems()).map(item => [item.id, item]));
        const paymentMethod = req.query.paymentMethod;
        res.status(200).render('receipt', { subtotal: calculateSubtotal(orderItems, menuItems), taxes: calculateTaxes(orderItems, menuItems), total: calculateTotal(orderItems, menuItems, 0), order: order, orderItems: orderItems, menuItems: menuItems, paymentMethod: paymentMethod }); // Pass the orderData to the order.ejs template
    } else {
        next(); // Let it 404
    }
}));

// Route to send an email receipt
router.post('/send-email-receipt', async (req, res) => {
    try {
        const { email } = req.body;

        const transporter = nodemailer.createTransport({
            host: 'smtp.example.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'your-email@example.com', // Replace with your email address
                pass: 'your-email-password' // Replace with your email password
            }
        });

        // Compose the email
        const mailOptions = {
            from: 'your-email@example.com', // Replace with your email address
            to: email,
            subject: 'Receipt from DigiDiner',
            text: 'Thank you for your order. Here is your receipt:',
            html: '<p>Thank you for your order. Here is your receipt:</p>' +
                '<p>... Include the receipt details here ...</p>'
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error sending email receipt:', error);
        res.sendStatus(500);
    }
});

function calculateSubtotal(orderItems, menuItems) {
    var subtotal = 0;
    orderItems.forEach(function (item) {
        subtotal += item.count * menuItems[item.itemId].price;
    });
    return subtotal;
}

function calculateTaxes(orderItems, menuItems) {
    var subtotal = calculateSubtotal(orderItems, menuItems);
    var taxes = subtotal * 0.1; // Assuming tax rate of 10%
    return taxes;
}

function calculateTotal(orderItems, menuItems, tip) {
    var subtotal = calculateSubtotal(orderItems, menuItems);
    var taxes = calculateTaxes(orderItems, menuItems);
    var total = parseFloat(subtotal) + parseFloat(taxes) + parseFloat(tip);
    return total;
}

module.exports = router;
