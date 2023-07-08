var express = require('express');
var router = express.Router();

var utils = require('../../utils');
var Table = require('../../models/table');
var Order = require('../../models/order');
var menuItemOption = require('../../models/menuItemOption');

// Used to require and identify an existing order with the param :order
const requireOrder = utils.asyncHandler(async function(req, res, next) {
    if (!req.params.order) {
        res.status(400).json({
            'error': "Invalid Request"
        });
        return;
    }
    req.order = new Order(req.params.order);
    if (!(await req.order.load())) {
        res.status(400).json({
            'error': "Invalid Order"
        });
        return;
    }
    next();
});

/* POST new order */
router.post('/order', utils.asyncHandler(async function(req, res) {
    if (!req.body.table) {
        res.status(400).json({
            'error': "Missing Required Fields"
        });
        return;
    }
    if (await Order.getOrderForTable(req.body.table)) {
        res.status(400).json({
            'error': "Table Already Has Outstanding Order"
        });
        return;
    }
    const newOrder = new Order(Math.floor(Math.random() * 18446744073709551615), req.body.table);
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

/* GET order */
router.get('/order/:order', requireOrder, utils.asyncHandler(async function(req, res) {
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

module.exports = router;
