var express = require('express');
var router = express.Router();
var menuController = require('../controllers/menuController');
var utils = require('../utils');
const menuData = require('../models/menuData');
var itemOption = require('../models/menuItemOption');
var optionData = require('../models/menuOptionData');

router.get('/', utils.asyncHandler(async function(req, res) {
    const menuItems = await menuData.getAllMenuItems();
    for (const menuItem of menuItems) menuItem.options = await itemOption.getOptionsForMenuItem(menuItem.id);

    res.status(200).render('menu', { menuItems });
}));

module.exports = router;
