var express = require('express');
var router = express.Router();
var menuController = require('../controllers/menuController');
var utils = require('../utils');
const menuData = require('../models/menuData');
const Order = require('../models/order');
var itemOption = require('../models/menuItemOption');
var optionData = require('../models/menuOptionData');

router.get('/', utils.asyncHandler(async function(req, res) {
    const menuItems = await menuData.getAllMenuItems();

    res.status(200).render('menu', { menuItems });
}));

router.get('/:id', utils.asyncHandler(async function(req, res, next) {
    const menuItems = await menuData.getAllMenuItems();
    const order = new Order(req.params.id);
    if (await order.load()) {
        res.status(200).render('menu', { menuItems, order });
    } else {
        next(); // Let it 404
    }
}));

module.exports = router;
