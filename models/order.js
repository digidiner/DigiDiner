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
                id INT PRIMARY KEY,
                table_id INT NOT NULL,
                payment_id INT DEFAULT NULL,
                status VARCHAR(10) NOT NULL DEFAULT 'incomplete'
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
    }

    static async listOrders() {
        return (await Order.conn.query(`SELECT * FROM \`order\``)).map(record => new Order(record.id, record.table_id, record.payment_id, record.status, record.time));
    }

    async getTable() {
        return await Table.getTable(this.tableId);
    }

    async getPayment() {
        return null; // TODO: Payment model incomplete and does not yet have code for loading a record from the database
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
}

module.exports = Order;