'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Product_categories', [
      {
        name: '棒棒糖',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '棉花糖',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '麥芽糖',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Product_categories', null, {});
  },
};
