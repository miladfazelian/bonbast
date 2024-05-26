require('dotenv').config(); // Require dotenv to load environment variables from a .env file

module.exports = {
  development: {
    username: 'root',
    password:  null,
    database: 'financial',
    host: '127.0.0.1',
    dialect: 'mysql',
    timezone: '+03:30', 
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    timezone: '+03:30', 
    port: process.env.DB_PORT,
  }
};
