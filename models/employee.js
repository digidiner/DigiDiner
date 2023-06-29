class Employee {
    id;
    passHash;
    nameFirst;
    nameLast;
    hireDate;
    position;

    constructor(id, passHash, nameFirst, nameLast, hireDate, position) {
        this.id = id;
        this.passHash = passHash;
        this.nameFirst = nameFirst;
        this.nameLast = nameLast ?? '';
        this.hireDate = hireDate ?? Date.now();
        this.position = position ?? EmployeePosition.None;
    }

    static connectDatabase(conn) {
        Employee.conn = conn;
        conn.query(`CREATE TABLE IF NOT EXISTS employee (
            id INT PRIMARY KEY,
            passHash BINARY(60) NOT NULL,
            nameFirst VARCHAR(50) NOT NULL,
            nameLast VARCHAR(50),
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
            this.hireDate = record.hireDate;
            this.position = record.position;
            return true;
        }
        return false;
    }

    async save() {
        const properties = [
            this.passHash,
            this.nameFirst,
            this.nameLast,
            this.hireDate,
            this.position.name
        ]
        await Employee.conn.query(`INSERT INTO employee (id, passHash, nameFirst, nameLast, hireDate, position) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE passHash=?, nameFirst=?, nameLast=?, hireDate=?, position=?`, [this.id, ...properties, ...properties]);
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