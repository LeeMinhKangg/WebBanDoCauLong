const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ProductAttribute = sequelize.define(
  'ProductAttribute',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    values: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
  },
  {
    tableName: 'product_attributes',
    timestamps: true,
  }
);

module.exports = ProductAttribute;
