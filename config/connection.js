
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: '127.0.0.1', // localhost
    dialect: 'mysql',
    define: {
      timestamps: false, // Disable timestamps by default
    },
  }
);

module.exports = sequelize;