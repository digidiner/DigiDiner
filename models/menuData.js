class menuData {
    constructor(dbConnPool) {
        this.dbConnPool = dbConnPool;
    }
    async initialize() {
        await this.createMenuTable();
    }
    createMenuTable = async () => {
        let connection;
        try {
            connection = await this.dbConnPool.getConnection();
            // Check if the menu table exists
            const tableExists = await connection.query(
                `SELECT 1
                 FROM information_schema.tables
                 WHERE table_schema = 'digidiner'
                   AND table_name = 'menu' LIMIT 1`
            );

            if (tableExists === 0) {
                // Create the menu table
                await connection.query(`
                    CREATE TABLE menu
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
        } catch (e) {
            throw e;
        }
        finally {
            if (connection) {
                connection.release();
            }
        }
    }

    // Get all the menu items
    async getAllMenuItems() {
        const connection = await this.dbConnPool.getConnection();
        try {
            const queryResult = await connection.query('SELECT * FROM menu');
            return queryResult;
        }
        catch (e) {
            throw e;
        } finally {
            connection.release();
        }
    }

    // Get individual menu item
    async getMenuItem(id) {
        const connection = await this.dbConnPool.getConnection();
        try {
            const queryResult = await connection.query('SELECT * FROM menu WHERE id = ?', [id]);
            if (queryResult.length > 0) {
                return queryResult[0];
            } else {
                return null;
            }
        } catch (e) {
            throw e;
        } finally {
            connection.release();
        }
    }

    async addMenuItem(item) {
        const { name, price, description } = item;
        const connection = await this.dbConnPool.getConnection();
        try {
            const queryResult = await connection.query('INSERT INTO menu (name, price, description) VALUES (?, ?, ?)', [name, price, description]);
            const insertedId = queryResult.insertId;
            return {id: insertedId, name: name, description: description};
        } catch (e) {
            throw e;
        } finally {
            connection.release();
        }
    }

    async updateMenu(id, newData) {
        const connection = await this.dbConnPool.getConnection();
        try {
            const queryResult = await connection.query('UPDATE menu SET ? WHERE id = ?', [newData, id]);
            return queryResult.affectedRows > 0;
        } catch (e) {
            throw e;
        } finally {
            connection.release();
        }
    }

    async removeMenuItem(id) {
        const connection = await this.dbConnPool.getConnection();
        try {
            const queryResult = await connection.query('DELETE FROM menu WHERE id = ?', [id]);
            return queryResult.affectedRows > 0;
        } catch (e) {
            throw e;
        } finally {
            connection.release();
        }
    }
}

module.exports = menuData;