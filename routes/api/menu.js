const express = require('express');
const router = express.Router();
const menuController = require('../../controllers/menuController');

// Routes for menu items
router.get('/menu', menuController.getAllMenuItems);
router.get('/menu/:id', menuController.getMenuItem);
router.post('/menu', menuController.addMenuItem);
router.put('/menu/:id', menuController.updateMenuItem);
router.delete('/menu/:id', menuController.removeMenuItem);

// Routes for menu options
router.get('/menuOptions', menuController.getAllMenuOption);
router.get('/menuOptions/:id', menuController.getMenuOption);
router.post('/menuOptions', menuController.addMenuOption);
router.put('/menuOptions/:id', menuController.updateMenuOption);
router.delete('/menuOptions/:id', menuController.removeMenuOption);

// Routes for menu item and option associations
router.post('/menuItems/:itemId/options/:optionId', menuController.addAssociation);
router.delete('/menuItems/:itemId/options/:optionId', menuController.removeAssociation);
router.get('/menuItems/:id/options', menuController.getOptionsForMenuItem);
router.get('/menuOptions/:id/menuItems', menuController.getMenuItemsForOption);

module.exports = router;