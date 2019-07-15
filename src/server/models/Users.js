// import dbConfig from './config';
const config = require('./config');
const Pool = require('pg').Pool;
const async = require('async');

module.exports = class Users {
  constructor() {
    this.pool = new Pool({
      user: config.user,
      host: config.host,
      database: config.database,
      password: config.password,
      port: config.port,
    });
  }

  async createUser(inputEmail, inputFirstName, inputLastName, inputPassword) {
    const passrules = /^[A-Za-z]\w{8,16}$/;

    if (!inputPassword.match(passrules)) {
      const message = { error: 'password too short'};
      throw message;
    }

    const sql = `
          INSERT INTO users (email, firstname, lastname, password) VALUES (
            '${inputEmail}',
            '${inputFirstName}',
            '${inputLastName}',
            crypt('${inputPassword}', gen_salt('bf', 8))
          );
          `;

    console.log(sql);

    const results = await this.pool.query(sql);
    return results;
  }

  async authenticateUser(inputEmail, inputPassword) {
    const sql = `
      SELECT id, firstname, lastname, email
      FROM users
      WHERE email = '${inputEmail}'
      AND password = crypt('${inputPassword}', password);
    `;

    const results = await this.pool.query(sql);
    return results;
  }

  async deleteUser(inputId) {
    const sql = `
      DELETE
      FROM users
      WHERE id = '${inputId}'
    `;

    const results = await this.pool.query(sql);
    return results;
  }

}
