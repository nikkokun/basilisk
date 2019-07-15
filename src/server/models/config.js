const env = process.env.NODE_ENV || 'development'; // 'dev' or 'test'

const dbConfig = {
  development: {
    user: 'postgres',
    password: process.env.BASILISK_DB_PASS,
    database: 'postgres',
    host: process.env.BASILISK_DB_HOST,
    port: 5432,
  },
  production: {
    user: 'postgres',
    password: process.env.BASILISK_DB_PASS,
    database: 'postgres',
    host: process.env.BASILISK_DB_HOST,
    port: 5432
  }
};

module.exports = dbConfig[env];
