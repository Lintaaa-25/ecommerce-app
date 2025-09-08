const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Item = require('./Item');

const Cart = sequelize.define('Cart', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});

// Associations
User.hasMany(Cart);
Cart.belongsTo(User);

Item.hasMany(Cart);
Cart.belongsTo(Item);

module.exports = Cart;
