'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Process extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Process.belongsTo(models.Client, { foreignKey: 'client_id', targetKey: 'client_id' });
      Process.belongsTo(models.Product, { foreignKey: 'product_id', targetKey: 'product_id' });
    }
  }
  Process.init({
    process_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      require: true
    },
    client_id: {
      type: DataTypes.INTEGER,
      require: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      require: true
    },
    first_price: {
      type: DataTypes.INTEGER,
      unique: false,
      require: true
    },
    month_count: {
      type: DataTypes.INTEGER,
      unique: false,
      require: true
    },
    percent: {
      type: DataTypes.INTEGER,
      unique: false,
      require: true
    },
    first_date: {
      type: DataTypes.STRING,
      unique: false,
      require: true
    },
    second_date: {
      type: DataTypes.STRING,
      unique: false,
      require: true
    },
    product_price: {
      type: DataTypes.INTEGER,
      unique: false,
      require: true
    },
    product_price_after_percent: {
      type: DataTypes.INTEGER,
      unique: false,
      require: true
    },
    discount: {
      type: DataTypes.INTEGER,
      require: true
    },
    final_price: {
      type: DataTypes.INTEGER,
      require: true
    },
  }, {
    sequelize,
    modelName: 'Process',
  });
  return Process;
};