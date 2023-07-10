class menuData {
    constructor(dbConnPool) {
        this.dbConnPool = dbConnPool;
    }

    static async connectDatabase(conn) {
        this.conn = conn;
        await conn.query(`
            CREATE TABLE IF NOT EXISTS full_menu
            (id INT(11) NOT NULL AUTO_INCREMENT,
             name VARCHAR(255) NOT NULL,
             price DECIMAL(10, 2) NOT NULL,
             description TEXT,
             category VARCHAR(255),
             PRIMARY KEY (id)
            )`);
    }
    // Get all the menu items
    async getAllMenuItems() {
        console.log("you are here");
        return await menuData.conn.query('SELECT * FROM full_menu');
    }

    // Get individual menu item
    async getMenuItem(id) {
        const queryResult = await menuData.conn.query('SELECT * FROM full_menu WHERE id = ?', [id]);
        if (queryResult.length > 0) {
            return queryResult[0];
        } else {
            return null;
        }
    }

    async addMenuItem(item) {
        const { name, price, description, category } = item;
        const queryResult = await menuData.conn.query('INSERT INTO full_menu (name, price, description, category) VALUES (?, ?, ?, ?)', [name, price, description, category]);
        const insertedId = queryResult.insertId;
        return {id: insertedId, name: name, description: description, category: category};
    }

    async updateMenu(id, newData) {
        let updateFields = [];
        let queryParams = [];

        // Construct the update fields and corresponding query parameters
        if (newData.name !== undefined) {
            updateFields.push('name = ?');
            queryParams.push(newData.name);
        }
        if (newData.price !== undefined) {
            updateFields.push('price = ?');
            queryParams.push(newData.price);
        }
        if (newData.description !== undefined) {
            updateFields.push('description = ?');
            queryParams.push(newData.description);
        }

        if (newData.category !== undefined) {
            updateFields.push('description = ?');
            queryParams.push(newData.category);
        }

        // Construct the SQL update statement
        const sql = `UPDATE menu SET ${updateFields.join(', ')} WHERE id = ?`;

        // Add the menu ID to the query parameters
        queryParams.push(id);

        // Execute the update query
        const queryResult = await menuData.conn.query(sql, queryParams);
        return queryResult.affectedRows > 0;
    }

    async removeMenuItem(id) {
        const queryResult = await menuData.conn.query('DELETE FROM full_menu WHERE id = ?', [id]);
        return queryResult.affectedRows > 0;
    }

    // Helper function to check if the menu item exists
    async checkMenuItemExists(menuItemId) {
        const query = 'SELECT id FROM full_menu WHERE id = ?';
        const [rows] = await menuData.conn.query(query, [menuItemId]);
        return rows.length > 0;
    }
    // Helper function to check if the association exists
    async checkAssociationExists(menuItemId, optionId){
        const query = 'SELECT * FROM full_menu WHERE menu_item_id = ? AND option_id = ?';
        const [rows] = await menuData.conn.query(query, [menuItemId, optionId]);
        return rows.length > 0;
    }
}

module.exports = menuData;