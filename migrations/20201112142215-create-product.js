'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ProductCategoryId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      picture_url: {
        type: Sequelize.STRING,
      },
      info: {
        type: Sequelize.TEXT,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      delivery: {
        type: Sequelize.ENUM('0', '1', '2'),
        defaultValue: '0',
      },
      delivery_location: {
        type: Sequelize.STRING,
      },
      delivery_time: {
        type: Sequelize.INTEGER,
      },
      payment_method: {
        type: Sequelize.ENUM('0', '1', '2'),
        defaultValue: '0',
      },
      remark: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.ENUM('0', '1', '2'),
        defaultValue: '0',
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Products');
  },
};
