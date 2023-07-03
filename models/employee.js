var bcrypt = require('bcrypt');

class Employee {
    static passSaltRounds = 10;

    id;
    passHash;
    nameFirst;
    nameLast;
    hireDate;
    position;

    constructor(id, passHash, nameFirst, nameLast, hireDate, position) {
        this.id = id;
        this.passHash = passHash ?? null;
        this.nameFirst = nameFirst ?? null;
        this.nameLast = nameLast ?? null;
        this.hireDate = hireDate ?? Date.now();
        this.position = position ?? EmployeePosition.None;
    }

    static connectDatabase(conn) {
        Employee.conn = conn;
        conn.query(`CREATE TABLE IF NOT EXISTS employee (
            id INT PRIMARY KEY,
            passHash BINARY(60) DEFAULT NULL,
            nameFirst VARCHAR(50) DEFAULT NULL,
            nameLast VARCHAR(50) DEFAULT NULL,
            hireDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            position VARCHAR(10) NOT NULL DEFAULT 'none'
        )`);
    }

    static async listEmployees() {
        return (await Employee.conn.query({ sql: `SELECT id FROM employee`, rowsAsArray: true })).flat();
    }

    async load() {
        const record = (await Employee.conn.query(`SELECT * FROM employee WHERE id = '${this.id}'`))[0];
        if (record && this.id == record.id) {
            this.passHash = record.passHash;
            this.nameFirst = record.nameFirst;
            this.nameLast = record.nameLast;
            this.hireDate = new Date(record.hireDate).getTime(); // Converts SQL timestamp milliseconds representation of date
            this.position = EmployeePosition.values[record.position];
            return true;
        }
        return false;
    }

    async save() {
        const properties = [
            this.passHash,
            this.nameFirst,
            this.nameLast,
            new Date(this.hireDate).toISOString().slice(0, 19).replace('T', ' '), // Converts JavaScript date to string acceptable by SQL
            this.position.name
        ]
        await Employee.conn.query(`INSERT INTO employee (id, passHash, nameFirst, nameLast, hireDate, position) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE passHash=?, nameFirst=?, nameLast=?, hireDate=?, position=?`, [this.id, ...properties, ...properties]);
    }

    auth(pass) {
        return pass ? bcrypt.hashSync(pass, Employee.passSaltRounds) == this.passHash : !this.passHash;
    }
}

class EmployeePosition {
    static values = [];

    static Manager = new EmployeePosition("manager")
    static Kitchen = new EmployeePosition("kitchen")
    static Waitstaff = new EmployeePosition("waitstaff")
    static None = new EmployeePosition("none")

    name;

    constructor(name) {
        this.name = name;
        EmployeePosition.values[name] = this;
    }
}

module.exports = Employee;