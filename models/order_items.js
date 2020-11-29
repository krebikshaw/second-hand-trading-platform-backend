'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order_items.belongsTo(models.Order);
      Order_items.belongsTo(models.Product);
    }
  };
  Order_items.init({
    product_name: DataTypes.STRING,
    product_category_id: DataTypes.STRING,
    product_picture_url: DataTypes.STRING,
    product_info: DataTypes.TEXT,
    product_price: DataTypes.INTEGER,
    product_quantity: DataTypes.INTEGER,
    product_delivery: DataTypes.INTEGER,
    orderId:DataTypes.INTEGER,
    productId:DataTypes.INTEGER,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Order_items',
    paranoid: true
  });
  return Order_items;
};
