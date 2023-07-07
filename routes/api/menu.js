const express = require('express');
const router = express.Router();
const menuController = require('../../controllers/menuController');

// Routes for menu items
router.route('/').get(menuController.getAllMenuItems);
router.route('/:id').get(menuController.getMenuItem);
router.route('/').post(menuController.addMenuItem);
router.route('/:id').put(menuController.updateMenuItem);
router.route('/:id').delete(menuController.removeMenuItem);

// Routes for menu options
router.route('/menuOption').get(menuController.getAllMenuOption);
router.route('/menuOption/:id').get(menuController.getMenuOption);
router.route('/menuOption/').post(menuController.addMenuOption);
router.route('/menuOption/:id').put(menuController.updateMenuOption);
router.route('/menuOption/:id').delete(menuController.removeMenuOption);

// Routes for menu item and option associations
router.route('/menuItems/:itemId/options/:optionId').post(menuController.addAssociation);
router.route('/menuItems/:itemId/options/:optionId').delete(menuController.removeAssociation);
router.route('/menuItems/:id/options').get(menuController.getOptionsForMenuItem);
router.route('/menuOptions/:id/menuItems').get(menuController.getMenuItemsForOption);

module.exports = router;