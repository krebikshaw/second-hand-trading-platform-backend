'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Product_category);
      Product.hasMany(models.Cart_items);
      Product.belongsTo(models.User);
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      picture_url: DataTypes.STRING,
      info: DataTypes.TEXT,
      price: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      delivery: DataTypes.ENUM('0', '1', '2'),
      delivery_location: DataTypes.STRING,
      delivery_time: DataTypes.INTEGER,
      payment_method: DataTypes.ENUM('0', '1', '2'),
      remark: DataTypes.TEXT,
      status: DataTypes.ENUM('0', '1', '2'),
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Product',
      paranoid: true,
    }
  );
  return Product;
};
