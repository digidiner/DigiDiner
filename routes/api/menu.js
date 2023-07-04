const express = require('express');
const router = express.Router();
const menuController = require('../../controllers/menuController');

// GET /api/menu
router.get('/', menuController.getAllMenuItems);

// GET /api/menu/:id
router.get('/:id', menuController.getMenuItem);

// POST /api/menu
router.post('/', menuController.addMenuItem);

// PUT /api/menu/:id
router.put('/:id', menuController.updateMenuItem);

// DELETE /api/menu/:id
router.delete('/:id', menuController.removeMenuItem);

module.exports = router;