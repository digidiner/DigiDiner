var Table = require('./table');
var Payment = require('./payment');

class Order {
    id;
    tableId;
    paymentId;
    status;
    time;

    constructor(id, tableId, paymentId, status, time) {
        this.id = id;
        this.tableId = tableId ?? null;
        this.paymentId = paymentId ?? null;
        this.status = status ?? 'incomplete';
        this.time = time ?? Date.now();
    }

    static connectDatabase(conn) {
        this.conn = conn;
        conn.query(`
            CREATE TABLE IF NOT EXISTS \`order\` (
                id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                table_id INT NOT NULL UNIQUE,
                payment_id INT DEFAULT NULL,
                status VARCHAR(10) NOT NULL DEFAULT 'incomplete',
                time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT order_fk_table_id
                    FOREIGN KEY (table_id) REFERENCES \`table\` (id)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                CONSTRAINT order_fk_payment_id
                    FOREIGN KEY (payment_id) REFERENCES payment (id)
                    ON DELETE SET NULL
                    ON UPDATE CASCADE
            )
        `);

        conn.query(`
            CREATE TABLE IF NOT EXISTS order_item (
                id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                order_id BIGINT UNSIGNED NOT NULL,
                item_id INT NOT NULL,
                count INT NOT NULL DEFAULT 1,
                CONSTRAINT order_item_fk_order_id
                    FOREIGN KEY (order_id) REFERENCES \`order\` (id)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                CONSTRAINT order_item_fk_item_id
                    FOREIGN KEY (item_id) REFERENCES menu (id)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
            )
        `);
        
        conn.query(`
            CREATE TABLE IF NOT EXISTS order_item_option (
                order_item_id BIGINT UNSIGNED NOT NULL,
                option_id INT NOT NULL,
                choice VARCHAR(50) DEFAULT NULL,
                CONSTRAINT order_item_option_pk
                    PRIMARY KEY (order_item_id, option_id),
                CONSTRAINT order_item_option_fk_order_item_id
                    FOREIGN KEY (order_item_id) REFERENCES order_item (id)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                CONSTRAINT order_item_option_fk_option_id
                    FOREIGN KEY (option_id) REFERENCES menu_option (id)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
            )
        `);
    }

    static async listOrders() {
        return (await Order.conn.query(`SELECT * FROM \`order\``)).map(record => new Order(record.id, record.table_id, record.payment_id, record.status, record.time));
    }

    static async getOrderForTable(tableId) {
        const record = (await Order.conn.query(`SELECT * FROM \`order\` WHERE table_id = '${tableId}'`))[0];
        if (record && tableId == record.table_id) {
            return new Order(record.id, record.table_id, record.payment_id, record.status, new Date(record.time).getTime());
        }
        return null;
    }

    async getTable() {
        return await Table.getTable(this.tableId);
    }

    async getPayment() {
        return null; // TODO: Payment model incomplete and does not yet have code for loading a record from the database
    }

    async getItems() {
        return (await Order.conn.query(`SELECT * FROM order_item WHERE order_id = '${this.id}'`)).map(record => new OrderItem(record.id, this, record.item_id, record.count));
    }

    async getItem(id) {
        const item = new OrderItem(id, this);
        if (await item.load()) return item;
        return null;
    }

    async addItem(itemId, count) {
        const result = await Order.conn.query(`INSERT INTO order_item (order_id, item_id, count) VALUES (?, ?, ?)`, [this.id, itemId, count ?? 1]);
        const newItem = new OrderItem(result.insertId, this, itemId, count);
        await Promise.all((await Order.conn.query(`SELECT * FROM menu_item_option WHERE menu_item_id = '${itemId}'`)).map(async (record) => {
            await Order.conn.query(`INSERT INTO order_item_option (order_item_id, option_id) VALUES (?, ?)`, [newItem.id, record.option_id]);
        }));
        return newItem;
    }

    async removeItem(id) {
        await Order.conn.query(`DELETE FROM order_item WHERE id = '${id}'`);
    }

    async updateStatus(status) {
        this.status = status;
        await this.save();
    }

    async load() {
        const record = (await Order.conn.query(`SELECT * FROM \`order\` WHERE id = '${this.id}'`))[0];
        if (record && this.id == record.id) {
            this.tableId = record.table_id;
            this.paymentId = record.payment_id;
            this.status = record.status;
            this.time = new Date(record.time).getTime(); // Converts SQL timestamp milliseconds representation of date
            return true;
        }
        return false;
    }

    async save() {
        const properties = [
            this.tableId,
            this.paymentId,
            this.status,
            new Date(this.time).toISOString().slice(0, 19).replace('T', ' '), // Converts JavaScript date to string acceptable by SQL
        ]
        await Order.conn.query(`INSERT INTO \`order\` (id, table_id, payment_id, status, time) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE table_id=?, payment_id=?, status=?, time=?`, [this.id, ...properties, ...properties]);
    }

    async delete() {
        await Order.conn.query(`DELETE FROM order WHERE id = '${this.id}'`);
    }
}

class OrderItem {
    id;
    order;
    itemId;
    count;

    constructor(id, order, itemId, count) {
        this.id = id;
        this.order = order;
        this.itemId = itemId;
        this.count = count ?? 1;
    }

    async getItemOption(option) {
        const itemOption = new OrderItemOption(this, option);
        if (await itemOption.load()) return itemOption;
        return null;
    }

    async load() {
        const record = (await Order.conn.query(`SELECT * FROM order_item WHERE id = '${this.id}'`))[0];
        if (record && this.id == record.id) {
            this.itemId = record.item_id;
            this.count = record.count;
            return true;
        }
        return false;
    }

    async save() {
        const properties = [
            this.order.id,
            this.itemId,
            this.count,
        ]
        await Order.conn.query(`INSERT INTO order_item (id, order_id, item_id, count) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE order_id=?, item_id=?, count=?`, [this.id, ...properties, ...properties]);
    }
}

class OrderItemOption {
    orderItem;
    option;
    choice;

    constructor(orderItem, option, choice) {
        this.orderItem = orderItem;
        this.option = option;
        this.choice = choice ?? null;
    }

    async load() {
        const record = (await Order.conn.query(`SELECT * FROM order_item_option WHERE order_item_id = '${this.orderItem.id}' AND option_id = '${this.option.id}'`))[0];
        if (record) {
            this.choice = record.choice;
            return true;
        }
        return false;
    }

    async save() {
        const properties = [
            this.choice,
        ]
        await Order.conn.query(`INSERT INTO order_item_option (order_item_id, option_id, choice) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE choice=?`, [this.orderItem.id, this.option.id, ...properties, ...properties]);
    }
}

module.exports = Order;