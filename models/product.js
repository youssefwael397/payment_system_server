'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category, { foreignKey: 'category_id', targetKey: 'category_id' });
      Product.belongsTo(models.Branch, { foreignKey: 'branch_id', targetKey: 'branch_id' });
    }
  }
  Product.init({
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      require: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      require: true
    },
    branch_id: {
      type: DataTypes.INTEGER,
      unique: true,
      require: true
    },
    product_name: {
      type: DataTypes.STRING,
      unique: false,
      require: true
    },
    product_price: {
      type: DataTypes.INTEGER,
      unique: false,
      require: true
    },
    count: {
      type: DataTypes.INTEGER,
      unique: false,
      require: true
    },
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};