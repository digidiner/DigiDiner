var express = require('express');
var router = express.Router();
var menuController = require('../controllers/menuController');
const menuData = require('../models/menuData');
var itemOption = require('../models/menuItemOption');
var optionData = require('../models/menuOptionData');

var express = require('express');
var router = express.Router();
var menuController = require('../controllers/menuController');
const menuData = require('../models/menuData');
var itemOption = require('../models/menuItemOption');
var optionData = require('../models/menuOptionData');
var dbConnPool = require('../controllers/databaseController').getConnection();

// Connect the database
menuData.connectDatabase(dbConnPool);
itemOption.connectDatabase(dbConnPool);
optionData.connectDatabase(dbConnPool);

router.get('/', async (req, res) => {
    try {
        const menu = new menuData();
        const menuItems = await menu.getAllMenuItems();
        const menuOptions = await optionData.getAllMenuOption();
        const menuAssociations = await itemOption.getOptionsForMenuItem(item.id);


        res.status(200).render('menu', { menuItems, menuOptions, menuAssociations });
    } catch (error) {
        console.error('Error retrieving menu items:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
