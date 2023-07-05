const databaseController = require('./databaseController');
const MenuData = require('../models/menuData');
const dbConnPool = databaseController.getConnection();
const menuData = new MenuData(dbConnPool);

async function getAllMenuItems(req, res, next) {
    try {
        const menuItems = await menuData.getAllMenuItems();
        res.json(menuItems);
    } catch (err) {
        next(err);
    }
}

async function getMenuItem(req, res, next) {
    const {id} = req.params;
    try {
        const menuItem = await menuData.getMenuItem(id);
        if (menuItem) {
            res.json(menuItem);
        } else {
            res.status(404);
        }
    } catch (err) {
        next(err);
    }
}

async function addMenuItem(req, res, next) {
    try {
        const {name, price, description} = req.body;
        // Validate that name, price and description are present
        if (!name || !price || !description) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Name, price, and description are required for adding a new menu item',
            });
        }

        const newItem = {name, price, description};

        const addItem = await menuData.addMenuItem(newItem);

        res.json({success: true, item: addItem}).status(200).json({
            success: true,
            item: newItem,
        });
    } catch (err) {
        next (err);
    }
}

async function updateMenuItem(req, res, next) {
    const {id} = req.params;
    const newData = req.body;
    try {
        const update = await menuData.updateMenu(id, newData);
        if (update) {
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        next(err);
    }
}

async function removeMenuItem(req, res, next) {
    const {id} = req.params;
    try {
        const removed = await menuData.removeMenuItem(id);
        if (removed) {
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllMenuItems,
    getMenuItem,
    addMenuItem,
    updateMenuItem,
    removeMenuItem,
}