class menuOptionData {
    constructor(dbConnPool) {
        this.dbConnPool = dbConnPool;
    }
    static connectDatabase(conn) {
        this.conn = conn;
        conn.query(`
            CREATE TABLE IF NOT EXISTS menu_options
            (
                id          INT AUTO_INCREMENT PRIMARY KEY,
                name        VARCHAR(255)   NOT NULL,
                description TEXT NOT NULL,
                type VARCHAR(255) NOT NULL,
                created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
    }

    async getAllMenuOption() {
        return await menuOptionData.conn.query('SELECT * FROM menu_options');
    }

    // Get individual menu item
    async getMenuOption(id) {
        const queryResult = await menuOptionData.conn.query('SELECT * FROM menu_options WHERE id = ?', [id]);
        if (queryResult.length > 0) {
            return queryResult[0];
        } else {
            return null;
        }
    }

    async addMenuOption(item) {
        const { name, description, type } = item;
        const queryResult = await menuOptionData.conn.query('INSERT INTO menu_options (name, description, type) ' +
            'VALUES (?, ?, ?, ?)', [name, description, type]);
        const insertedId = queryResult.insertId;
        return {id: insertedId, name, description, type};
    }

    async updateMenuOption(id, newData) {
        let updateFields = [];
        let queryParams = [];

        // Construct the update fields and corresponding query parameters
        if (newData.name !== undefined) {
            updateFields.push('name = ?');
            queryParams.push(newData.name);
        }
        if (newData.description !== undefined) {
            updateFields.push('description = ?');
            queryParams.push(newData.description);
        }

        if (newData.type !== undefined) {
            updateFields.push('type = ?');
            queryParams.push(newData.type);
        }

        const sql = `UPDATE menu SET ${updateFields.join(', ')} WHERE id = ?`;
        queryParams.push(id);

        const queryResult = await menuOptionData.conn.query(sql, queryParams);
        return queryResult.affectedRows > 0;
    }

    async removeMenuOption(id) {
        const queryResult = await menuOptionData.conn.query('DELETE FROM menu WHERE id = ?', [id]);
        return queryResult.affectedRows > 0;
    }

    async getMenuItemsForOption(optionId) {
        const queryResult = await menuOptionData.conn.query('SELECT * FROM menu m JOIN menu_item_option mio ON m.id = mio.menu_item_id WHERE mio.option_id = ?', [optionId]);
        return queryResult;
    }
}

module.exports = menuOptionData;

