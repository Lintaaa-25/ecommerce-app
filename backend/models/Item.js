const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Item = sequelize.define('Item', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  image: {
  type: DataTypes.STRING, // store URL or path
  allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Item;
