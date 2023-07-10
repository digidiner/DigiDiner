class menuOptionData {
    constructor(dbConnPool) {
        this.dbConnPool = dbConnPool;
    }

    static async connectDatabase(conn) {
        this.conn = conn;
        conn.query(`
            CREATE TABLE IF NOT EXISTS full_menu_options
            (
                id           INT(11)      NOT NULL AUTO_INCREMENT,
                name         VARCHAR(255) NOT NULL,
                description  TEXT,
                choices      INT,
                full_menu_id INT(11)      NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (full_menu_id) REFERENCES full_menu (id) ON DELETE CASCADE
            )`);
    }

    async getAllMenuOption() {
        console.log("you are here");
        return await menuOptionData.conn.query('SELECT * FROM full_menu_options');
    }

    // Get individual menu item
    async getMenuOption(id) {
        const queryResult = await menuOptionData.conn.query('SELECT * FROM full_menu_options WHERE id = ?', [id]);
        if (queryResult.length > 0) {
            return queryResult[0];
        } else {
            return null;
        }
    }

    async addMenuOption(item) {
        const { name, description, choices } = item;
        const queryResult = await menuOptionData.conn.query('INSERT INTO full_menu_options (name, description, choices) ' +
            'VALUES (?, ?, ?)', [name, description, choices]);
        const insertedId = queryResult.insertId;
        return {id: insertedId, name, description, choices};
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

        if (newData.choices !== undefined) {
            updateFields.push('choices = ?');
            queryParams.push(newData.choices);
        }

        const sql = `UPDATE full_menu_options SET ${updateFields.join(', ')} WHERE id = ?`;
        queryParams.push(id);

        const queryResult = await menuOptionData.conn.query(sql, queryParams);
        return queryResult.affectedRows > 0;
    }

    async removeMenuOption(id) {
        const queryResult = await menuOptionData.conn.query('DELETE FROM full_menu_options WHERE id = ?', [id]);
        return queryResult.affectedRows > 0;
    }

    // Helper function to check if the option exists
    const checkOptionExists = async (optionId) => {
        const query = 'SELECT id FROM full_menu_options WHERE id = ?';
        const [rows] = await menuOptionData.conn.query(query, [optionId]);
        return rows.length > 0;
    };
}

module.exports = menuOptionData;

