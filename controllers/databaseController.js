const mariadb = require('mariadb');
const fs = require('fs');

const dbConfig = JSON.parse(fs.readFileSync('../config/dbConfig.json'));

const dbConnPool = mariadb.createPool(dbConfig);

async function getConnection() {
     return await dbConnPool.getConnection();
}

module.exports = {
     getConnection
}