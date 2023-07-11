var express = require('express');
var router = express.Router();
var menuController = require('../controllers/menuController');
const menuData = require('../models/menuData');
var itemOption = require('../models/menuItemOption');
var optionData = require('../models/menuOptionData');

router.get('/', async (req, res) => {
    const menuItems = await menuData.getAllMenuItems();
    for (const menuItem of menuItems) menuItem.options = await itemOption.getOptionsForMenuItem(menuItem.id);

    res.status(200).render('menu', { menuItems, menuOptions });
});

module.exports = router;
