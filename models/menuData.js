class menuData {
    constructor(dbConnPool) {
        this.dbConnPool = dbConnPool;
    }

    static connectDatabase(conn) {
        this.conn = conn;
        conn.query(`
            CREATE TABLE IF NOT EXISTS menu
            (
                id          INT AUTO_INCREMENT PRIMARY KEY,
                name        VARCHAR(255)   NOT NULL,
                price       DECIMAL(10, 2) NOT NULL,
                description TEXT,
                created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
    }

    // Get all the menu items
    async getAllMenuItems() {
        return await menuData.conn.query('SELECT * FROM menu');
    }

    // Get individual menu item
    async getMenuItem(id) {
        const queryResult = await menuData.conn.query('SELECT * FROM menu WHERE id = ?', [id]);
        if (queryResult.length > 0) {
            return queryResult[0];
        } else {
            return null;
        }
    }

    async addMenuItem(item) {
        const { name, price, description } = item;
        const queryResult = await menuData.conn.query('INSERT INTO menu (name, price, description) VALUES (?, ?, ?)', [name, price, description]);
        const insertedId = queryResult.insertId;
        return {id: insertedId, name: name, description: description};
    }

    async updateMenu(id, newData) {
        const { price, description } = newData;
        const queryResult = await menuData.conn.query(
            'UPDATE menu SET price = ?, description = ?, WHERE id = ?',
            [price, description, id]
        );

        return queryResult.affectedRows > 0;
    }

    async removeMenuItem(id) {
        const queryResult = await menuData.conn.query('DELETE FROM menu WHERE id = ?', [id]);
        return queryResult.affectedRows > 0;
    }
}

module.exports = menuData;