// import dbConfig from './config';
const config = require('./config');
const Pool = require('pg').Pool;
const async = require('async');

module.exports = class Devices {
  constructor() {
    this.pool = new Pool({
      user: config.user,
      host: config.host,
      database: config.database,
      password: config.password,
      port: config.port,
    });
  }

  async createDevice(devicename, devicepass, isEnabled, isAlert, isAlarm, ownerId) {

    const valSql = `SELECT * FROM devices WHERE devicename = '${devicename}'`;

    try {
      const valResults = await this.pool.query(valSql);
      if (valResults.rowCount !== 0) {
        const error = 'device already exists';
        throw error;
      }
    } catch (e) {
      console.log(e);
    }


    const sql = `
          INSERT INTO devices (devicename, devicepass, is_enabled, is_alert, is_alarm, owner_id) VALUES (
            '${devicename}',
            crypt('${devicepass}', gen_salt('bf', 8)),
            '${isEnabled}',
            '${isAlert}',
            '${isAlarm}',
            ${ownerId}
          );
          `;
    try {
      const create = await this.pool.query(sql);
      const results = await this.readDevice(devicename);
      return results;
    } catch(e) {
      console.log(e);
    }
  }
  async readDevices(ownerId) {
    const sql = `SELECT * FROM devices WHERE owner_id = ${ownerId}`;

    try {
      const results = await this.pool.query(sql);
      return results.rows;
    } catch (e) {
      console.log(e);
    }
  }

  async readDevice(devicename) {
    const sql = `SELECT * FROM devices WHERE devicename = '${devicename}'`;
    console.log(sql);

    try {
      const results = await this.pool.query(sql);
      return results.rows[0];
    } catch (e) {
      console.log(e);
    }
  }

  async updateDevice(devicename, column, value) {
    const sql = `UPDATE devices SET ${column} = ${value} WHERE devicename = '${devicename}'`;

    try {
      const update = await this.pool.query(sql);
      const results = await this.readDevice(devicename);
      return results;
    } catch (e) {
      console.log(e);
    }
  }
}
