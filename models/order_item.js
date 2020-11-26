'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order_item.belongsTo(models.Order);
      Order_item.belongsTo(models.Product);
    }
  };
  Order_item.init({
    product_name: DataTypes.STRING,
    product_category_id: DataTypes.STRING,
    product_picture_url: DataTypes.STRING,
    product_info: DataTypes.TEXT,
    product_price: DataTypes.INTEGER,
    product_quantity: DataTypes.INTEGER,
    product_delivery: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order_items',
    paranoid: true
  });
  return Order_item;
};
