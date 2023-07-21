var express = require('express');
var router = express.Router();
var menuController = require('../controllers/menuController');
var utils = require('../utils');
const menuData = require('../models/menuData');
const Order = require('../models/order');
var itemOption = require('../models/menuItemOption');
var optionData = require('../models/menuOptionData');

router.get('/management', utils.asyncHandler(async function (req, res) {
    const menuItems = await menuData.getAllMenuItems();
    res.status(200).render('menuManagement', { menuItems });
}));

module.exports = router;
