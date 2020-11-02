const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  "development": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "custom_oauth_client",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "custom_oauth_test_client",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false,
  },
  "production": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "custom_oauth_prod_client",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}