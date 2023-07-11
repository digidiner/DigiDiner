var express = require('express');
var router = express.Router();
var menuController = require('../controllers/menuController');
const menuData = require('../models/menuData');
var itemOption = require('../models/menuItemOption');
var optionData = require('../models/menuOptionData');

router.get('/', async (req, res) => {
    try {
        const menuItems = await menuData.getAllMenuItems();
        const menuOptions = await optionData.getAllMenuOption();
        const menuItemId = req.params.id;
        const menuAssociations = await itemOption.getOptionsForMenuItem(menuItemId);

        res.status(200).render('menu', { menuItems, menuOptions, menuAssociations });
    } catch (error) {
        console.error('Error retrieving menu items:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
