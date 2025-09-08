// config/db.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,    // ecommerce_db
  process.env.DB_USER,    // postgres
  process.env.DB_PASSWORD,// li25062005!@#
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false,
  }
);

module.exports = { sequelize }; // <-- IMPORTANT: export as object
