class menuItemOption {
    constructor(dbConnPool) {
        this.dbConnPool = dbConnPool;
    }
    static async connectDatabase(conn) {
        this.conn = conn;
        await conn.query(`
      CREATE TABLE IF NOT EXISTS menu_item_option (
        menu_item_id INT,
        option_id INT,
        FOREIGN KEY (menu_item_id) REFERENCES menu(id),
        FOREIGN KEY (option_id) REFERENCES menu_options(id)
      )
    `);
    }
    async addAssociation(menuItemId, optionId) {
        const queryResult = await menuItemOption.conn.query(
            'INSERT INTO menu_item_option (menu_item_id, option_id) VALUES (?, ?)',
            [menuItemId, optionId]
        );
        return queryResult.affectedRows > 0;
    }
    async removeAssociation(menuItemId, optionId) {
        const queryResult = await menuItemOption.conn.query(
            'DELETE FROM menu_item_option WHERE menu_item_id = ? AND option_id = ?',
            [menuItemId, optionId]
        );
        return queryResult.affectedRows > 0;
    }

    async getOptionsForMenuItem(menuItemId) {
        const queryResult = await menuItemOption.conn.query('SELECT * FROM menu_options mo JOIN menu_item_option mio ON mo.id = mio.option_id WHERE mio.menu_item_id = ?', [menuItemId]);
        return queryResult;

    }

    async getMenuItemsForOption(optionId) {
        const queryResult = await menuItemOption.conn.query('SELECT * FROM menu mi JOIN menu_item_options mio ON mi.id = mio.menu_item_id WHERE mio.option_id = ?', [optionId]);
        return queryResult;
    }
}

module.exports = menuItemOption;