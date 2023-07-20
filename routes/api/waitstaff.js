var express = require('express');
var router = express.Router();

var utils = require('../../utils');
var Table = require('../../models/table');
var Order = require('../../models/order');
var menuItemOption = require('../../models/menuItemOption');

// Used to verify user is signed in and a waitstaff
function requireSession(req, res, next) {
    if (!req.employee) {
        res.status(401).json({
            'error': "Not Signed In"
        });
        return;
    }
    if (!req.employee.position.includes("waitstaff") && !req.employee.position.includes("manager")) {
        res.status(403).json({
            'error': "Not Authorized"
        });
        return;
    }
    next();
}

/* POST new order */
router.post('/order', requireSession, utils.asyncHandler(async function(req, res) {
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
    const table = new Table(req.body.tableId);
    await table.load();
    table.status = 'occupied';
    await table.save();
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

/* GET order by id or table */
router.get('/order', requireOrder, utils.asyncHandler(async function(req, res) {
    if ((req.query.orderId == null) == (req.query.tableId == null)) {
        res.status(400).json({
            'error': "Unnaceptable Query"
        });
        return;
    }
    const order = req.query.orderId != null ? await Order.getOrderById(req.body.orderId) : await Order.getOrderForTable(req.body.tableId);
    if (order == null) {
        res.status(404).json({
            'error': "Order Does Not Exist",
            'status': "No order"
        });
        return;
    }
    res.status(200).json({
        'id': order.id,
        'tableId': order.tableId,
        'paymentId': order.paymentId,
        'status': order.status,
        'time': order.time,
        'items': await Promise.all((await order.getItems()).map(async item => ({
            'id': item.id,
            'itemId': item.itemId,
            'count': item.count,
            'options': Object.fromEntries((await menuItemOption.getOptionsForMenuItem(item.itemId)).map(itemOption => [itemOption.option.id, itemOption.choice]))
        })))
    });
}));

/* GET order list */
router.get('/order/list', requireSession, utils.asyncHandler(async function(req, res) {
    const orders = await Order.listOrders();
    res.status(200).json(await Promise.all(orders.map(async order => ({
        'id': order.id,
        'tableId': order.tableId,
        'paymentId': order.paymentId,
        'status': order.status,
        'time': order.time,
        'items': await Promise.all((await order.getItems()).map(async item => ({
            'id': item.id,
            'itemId': item.itemId,
            'count': item.count,
            'options': Object.fromEntries((await menuItemOption.getOptionsForMenuItem(item.itemId)).map(itemOption => [itemOption.option.id, itemOption.choice]))
        })))
    }))));
}));

/* PUT order status */
router.put('/order/status', requireSession, utils.asyncHandler(async function(req, res) {
    if (req.body.orderId == null || req.body.status == null) {
        res.status(400).json({
            'error': "Missing Required Fields"
        });
        return;
    }
    const order = new Order(req.body.orderId);
    if (!(await req.order.load())) {
        res.status(400).json({
            'error': "Invalid or Expired Order"
        });
        return;
    }
    order.status = req.body.status;
    await order.save();
    res.status(200).json({
        'id': order.id,
        'tableId': order.tableId,
        'paymentId': order.paymentId,
        'status': order.status,
        'time': order.time,
        'items': await Promise.all((await order.getItems()).map(async item => ({
            'id': item.id,
            'itemId': item.itemId,
            'count': item.count,
            'options': Object.fromEntries((await menuItemOption.getOptionsForMenuItem(item.itemId)).map(itemOption => [itemOption.option.id, itemOption.choice]))
        })))
    });
}));

/* GET table */
router.get('/table', requireSession, utils.asyncHandler(async function(req, res) {
    if (req.body.id == null) {
        res.status(400).json({
            'error': "Missing Required Fields"
        });
        return;
    }
    let table = await Table.getTable(req.body.id);
    res.status(200).json({
        'id': table.id,
        'seats': table.seats,
        'posX': table.posX,
        'posY': table.posY,
        'status': table.status
    });
}));

/* PUT table status */
router.put('/table/status', requireSession, utils.asyncHandler(async function(req, res) {
    if (req.body.id == null) {
        res.status(400).json({
            'error': "Missing Required Fields"
        });
        return;
    }
    let table = await Table.getTable(req.body.id);
    if (req.body.status) table.status = req.body.status;
    await table.save();
    res.status(200).json({
        'id': table.id,
        'seats': table.seats,
        'posX': table.posX,
        'posY': table.posY,
        'status': table.status
    });
}));

/* GET table list */
router.get('/table/list', requireSession, utils.asyncHandler(async function(req, res) {
    res.status(200).json((await Table.listTables()).map(table => ({
        'id': table.id,
        'seats': table.seats,
        'posX': table.posX,
        'posY': table.posY,
        'status': table.status
    })));
}));

module.exports = router;
