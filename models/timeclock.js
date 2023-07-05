class TimeClock {
    employeeId;

    constructor(employeeId) {
        this.employeeId = employeeId;
    }

    static connectDatabase(conn) {
        this.conn = conn;
        conn.query(`
            CREATE TABLE IF NOT EXISTS timeclock (
                start_time TIMESTAMP NOT NULL,
                end_time TIMESTAMP DEFAULT NULL,
                employee_id INT NOT NULL,
                CONSTRAINT timeclock_pk
                    PRIMARY KEY (start_time, employee_id),
                CONSTRAINT timeclock_fk_employee_id
                    FOREIGN KEY (employee_id) REFERENCES employee (id)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
            )
        `);
    }

    async clockIn() {
        let activePeriod = await this.getActivePeriod();
        if (activePeriod) return null;
        let startTime = Date.now();
        return await this.addPeriod(startTime);
    }

    async clockOut() {
        let activePeriod = await this.getActivePeriod();
        if (!activePeriod) return null;
        activePeriod.endTime = Date.now();
        await activePeriod.save();
        return activePeriod;
    }

    async getPeriod(startTime) {
        return await this.getDay(startTime).getPeriod(startTime);
    }

    async addPeriod(startTime, endTime) {
        return await this.getDay(startTime).addPeriod(startTime, endTime);
    }

    async getTotalTime() {
        return (await TimeClock.conn.query(`
            SELECT SUM(TIMESTAMPDIFF(MICROSECOND, start_time, CASE WHEN end_time IS NOT NULL THEN end_time ELSE CURRENT_TIMESTAMP END) / 1000) 
                AS total_time 
                FROM timeclock 
                WHERE employee_id = '${this.employeeId}'
        `))[0].total_time;
    }

    getDay(day) {
        return new TimeClockDay(this, day % (24 * 60 * 60 * 1000));
    }

    async listPeriods() {
        return (await TimeClock.conn.query({ sql: `
            SELECT start_time 
                FROM timeclock 
                WHERE employee_id = '${this.employeeId}'
        `, rowsAsArray: true })).flat();
    }

    async getActivePeriod() {
        let activeRow = await TimeClock.conn.query(`
            SELECT start_time 
                FROM timeclock 
                WHERE employee_id = '${this.employeeId}'
                    AND end_time IS NULL
        `)[0];
        if (!activeRow) return null;
        return await this.getPeriod(activeRow.start_time);
    }
}

class TimeClockDay {
    timeClock;
    day;

    constructor(timeClock, day) {
        this.timeClock = timeClock;
        this.day = day;
    }

    async getPeriod(startTime) {
        let period = new TimeClockPeriod(this, startTime);
        if (await period.load()) return period;
        return null;
    }

    async addPeriod(startTime, endTime) {
        let period = new TimeClockPeriod(this, startTime, endTime);
        await period.save();
        return period;
    }

    async getTotalTime() {
        return (await TimeClock.conn.query(`
            SELECT SUM(TIMESTAMPDIFF(MICROSECOND, start_time, CASE WHEN end_time IS NOT NULL THEN end_time ELSE CURRENT_TIMESTAMP END) / 1000) 
                AS total_time 
                FROM timeclock 
                WHERE employee_id = '${this.timeClock.employeeId}' 
                    AND start_time >= '${new Date(this.day).toISOString().split('T')[0]}' 
                    AND start_time < '${new Date(this.day + (24 * 60 * 60 * 1000)).toISOString().split('T')[0]}'
        `))[0].total_time;
    }

    async listPeriods() {
        return (await TimeClock.conn.query({ sql: `
            SELECT start_time 
                FROM timeclock 
                WHERE employee_id = '${this.timeClock.employeeId}' 
                    AND start_time >= '${new Date(this.day).toISOString().split('T')[0]}' 
                    AND start_time < '${new Date(this.day + (24 * 60 * 60 * 1000)).toISOString().split('T')[0]}'
        `, rowsAsArray: true })).flat();
    }
}

class TimeClockPeriod {
    timeClockDay;
    startTime;
    endTime;

    constructor(timeClockDay, startTime, endTime) {
        this.timeClockDay = timeClockDay;
        this.startTime = startTime ?? Date.now();
        this.endTime = endTime ?? null;
    }

    async load() {
        const record = (await TimeClock.conn.query(`
            SELECT * 
                FROM timeclock 
                WHERE employee_id = '${this.timeClockDay.timeClock.employeeId}' 
                    AND start_time = '${new Date(this.startTime).toISOString().slice(0, 19).replace('T', ' ')}'
        `))[0];
        if (record) {
            this.endTime = new Date(record.end_time).getTime(); // Converts SQL timestamp milliseconds representation of date
            return true;
        }
        return false;
    }

    async save() {
        const properties = [
            new Date(this.endTime).toISOString().slice(0, 19).replace('T', ' '),
        ]
        await TimeClock.conn.query(`
            INSERT INTO timeclock (start_time, employee_id, end_time) 
                VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE 
                end_time=?
        `, [new Date(this.startTime).toISOString().slice(0, 19).replace('T', ' '), this.timeClockDay.timeClock.employeeId, ...properties, ...properties]);
    }
}

module.exports = TimeClock;