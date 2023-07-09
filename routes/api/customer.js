var express = require('express');
var router = express.Router();

var utils = require('../../utils');
var Table = require('../../models/table');
var Order = require('../../models/order');
var menuItemOption = require('../../models/menuItemOption');

// Used to require and identify an existing order with the param :order
const requireOrder = utils.asyncHandler(async function(req, res, next) {
    if (!req.query.orderId) {
        res.status(400).json({
            'error': "Invalid Request"
        });
        return;
    }
    req.order = new Order(req.query.orderId);
    if (!(await req.order.load())) {
        res.status(400).json({
            'error': "Invalid or Expired Order"
        });
        return;
    }
    next();
});

/* POST new order */
router.post('/order', utils.asyncHandler(async function(req, res) {
    if (req.body.tableId == null) {
        res.status(400).json({
            'error': "Missing Required Fields"
        });
        return;
    }
    if (await Order.getOrderForTable(req.body.tableId)) {
        res.status(400).json({
            'error': "Table Already Has Associated Order"
        });
        return;
    }
    const newOrder = new Order(Math.floor(Math.random() * 18446744073709551615), req.body.tableId);
    await newOrder.save();
    res.status(201).json({
        'id': newOrder.id,
        'tableId': newOrder.tableId,
        'paymentId': newOrder.paymentId,
        'status': newOrder.status,
        'time': newOrder.time,
        'items': await Promise.all((await newOrder.getItems()).map(async item => ({
            'id': item.id,
            'itemId': item.itemId,
            'count': item.count,
            'options': Object.fromEntries((await menuItemOption.getOptionsForMenuItem(item.itemId)).map(itemOption => [itemOption.option.id, itemOption.choice]))
        })))
    });
}));

/* GET order info */
router.get('/order', requireOrder, utils.asyncHandler(async function(req, res) {
    res.status(200).json({
        'id': req.order.id,
        'tableId': req.order.tableId,
        'paymentId': req.order.paymentId,
        'status': req.order.status,
        'time': req.order.time,
        'items': await Promise.all((await req.order.getItems()).map(async item => ({
            'id': item.id,
            'itemId': item.itemId,
            'count': item.count,
            'options': Object.fromEntries((await menuItemOption.getOptionsForMenuItem(item.itemId)).map(itemOption => [itemOption.option.id, itemOption.choice]))
        })))
    });
}));

/* POST new order item */
router.post('/order/item', requireOrder, utils.asyncHandler(async function(req, res) {
    if (req.body.itemId == null) {
        res.status(400).json({
            'error': "Missing Required Fields"
        });
        return;
    }
    const newItem = await req.order.addItem(req.body.itemId, req.body.count);
    let newItemOptions = [];
    if (req.body.options != null) {
        for (const optionKey in req.body.options) {
            const option = await newItem.getItemOption(optionKey);
            if (option != null) {
                option.choice = req.body.options[optionKey];
                newItemOptions.push(option);
            }
        }
    }
    await Promise.all(optionSavePromises);
    res.status(201).json({
        'id': item.id,
        'itemId': item.itemId,
        'count': item.count,
        'options': Object.fromEntries((await menuItemOption.getOptionsForMenuItem(item.itemId)).map(itemOption => [itemOption.option.id, itemOption.choice]))
    });
}));

/* DELETE order item */
router.delete('/order/item', requireOrder, utils.asyncHandler(async function(req, res) {
    if (req.body.itemId == null) {
        res.status(400).json({
            'error': "Missing Required Fields"
        });
        return;
    }
    if (await req.order.removeItem(req.body.itemId)) {
        res.status(204).json({});
    } else {
        res.status(404).json({
            'error': "Order Item Does Not eXist"
        });
    }
}));

/* DELETE order */
router.delete('/order', requireOrder, utils.asyncHandler(async function(req, res) {
    if (await req.order.delete()) {
        res.status(204).json({});
    } else {
        res.status(404).json({
            'error': "Order Does Not eXist"
        });
    }
}));

module.exports = router;
