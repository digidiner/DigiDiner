const databaseController = require('./databaseController');
const MenuData = require('../models/menuData');
const MenuOptionsData = require('../models/menuOptionData');
const MenuItemOption = require('../models/menuItemOption');

const dbConnPool = databaseController.getConnection();
const menuData = new MenuData(dbConnPool);
const menuOptions = new MenuOptionsData(dbConnPool);
const menuItemOption = new MenuItemOption(dbConnPool)

// CRUD operations for the menu
async function getAllMenuItems(req, res) {
    const menuItems = await menuData.getAllMenuItems();
    if (menuItems) {
        res.status(200).json(menuItems);
    } else {
        res.status(404).json({"message": "No menu items"});
    }
}

async function getMenuItem(req, res) {
    const {id} = req.params;
    const menuItem = await menuData.getMenuItem(id);
    if (menuItem) {
        res.status(200).json(menuItem);
    } else {
        res.status(404).json({"message":" No item found"});
    }
}

async function addMenuItem(req, res) {
    const {name, price, description} = req.body;
    // Validate that name, price and description are present
    if (!name || !price || !description) {
        return res.status(400).json({
            "message": 'Name, price, and description are required for adding a new menu item',
        });
    }
    const newItem = {name, price, description};

    const addItem = await menuData.addMenuItem(newItem);

    if (addItem) {
        res.status(200).json({"message": "Added menu item"});
    } else {
        res.status(404).json({"message": "Item not added"});
    }
}

async function updateMenuItem(req, res) {
    const {id} = req.params;
    const newData = req.body;
    const update = await menuData.updateMenu(id, newData);
    if (update) {
        res.status(200).json({"message": "Updated menu item updated"});
    } else {
        res.status(404).json({"message": "Item was not updated"});
    }
}

async function removeMenuItem(req, res) {
    const {id} = req.params;
    const removed = await menuData.removeMenuItem(id);
    if (removed) {
        res.status(200).json({"message": "Updated menu item removed"});;
    } else {
        res.status(404).json({"message": "Updated menu item not found"});;
    }
}

// CRUD operations for menu options

async function getAllMenuOption(req, res) {
    const menuItems = await menuOptions.getAllMenuOption();
    if (menuItems) {
        res.status(200).json(menuItems);
    } else {
        res.status(404).json({"message": "No menu options found"});
    }
}

async function getMenuOption(req, res) {
    const { id } = req.params;
    const menuOption = await menuOptions.getMenuOption(id);
    if (menuOption) {
        res.status(200).json(menuOption);
    } else {
        res.status(404).json({"message": "No menu option found"});
    }
}

async function addMenuOption(req, res) {
    const {name, description, type} = req.body;
    // Validate that name, price and description are present
    if (!name || !description || !type) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Name, description, and type are required for adding a new menu option',
        });
    }

    const newItem = {name, description, type};

    const addItem = await menuOptions.addMenuOption(newItem);

    if (addItem) {
        res.status(200).json({"message": "Added menu option"});
    } else {
        res.status(404).json({"message": "Item not added"});
    }
}

async function updateMenuOption(req, res) {
    const {id} = req.params;
    const newData = req.body;
    const update = await menuOptions.updateMenuOption(id, newData);
    if (update) {
        res.status(200).json({"message": "Option updated"});
    } else {
        res.status(404).json({"message": "Item was not updated"});
    }
}

async function removeMenuOption(req, res) {
    const {id} = req.params;
    const removed = await menuOptions.removeMenuOption(id);
    if (removed) {
        res.status(200).json({"message": "Menu option removed"});
    } else {
        res.status(404).json({"message": "Menu option not found"});
    }
}

// CRUD operations for menu items and options JOIN

async function addAssociation(req, res) {
    const { itemId, optionId } = req.params;
    const added = await menuItemOption.addAssociation(itemId, optionId);
    if (added) {
        res.status(200).json({"message": "The association has been added successfully"});
    } else {
        res.status(404).json({"message": "The association was not added"});
    }
}

async function removeAssociation(req, res) {
    const { itemId, optionId } = req.params;
    const removed = await menuItemOption.removeAssociation(itemId, optionId);
    if (removed) {
        res.status(200).json({"message": "The association has been removed"});
    } else {
        res.status(404).json({"message": "The association was not found"});
    }
}

async function getOptionsForMenuItem(req, res) {
    const { id } = req.params;
    const options = await menuItemOption.getOptionsForMenuItem(id);
    if (options) {
        res.status(200).json(options);
    } else {
        res.status(404).json({"message": "No options found"});
    }
}
async function getMenuItemsForOption(req, res, next) {
    const { id } = req.params;
    const menuItems = await menuItemOption.getMenuItemsForOption(id);
    if (menuItems) {
        res.status(200).json(menuItems);
    } else {
        res.status(404).json({"message": "Menu item not found"});
    }
}


module.exports = {
    getAllMenuItems,
    getMenuItem,
    addMenuItem,
    updateMenuItem,
    removeMenuItem,
    getAllMenuOption,
    getMenuOption,
    addMenuOption,
    updateMenuOption,
    removeMenuOption,
    addAssociation,
    removeAssociation,
    getOptionsForMenuItem,
    getMenuItemsForOption,
}