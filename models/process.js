"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Process extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Process.belongsTo(models.Client, {
        foreignKey: "client_id",
        targetKey: "client_id",
      });
      Process.belongsTo(models.Sales, {
        foreignKey: "sales_id",
        targetKey: "sales_id",
      });
      Process.belongsTo(models.Product, {
        foreignKey: "product_id",
        targetKey: "product_id",
      });
    }
  }
  Process.init(
    {
      process_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        require: true,
      },
      sales_id: {
        type: DataTypes.INTEGER,
        require: true,
      },
      client_id: {
        type: DataTypes.INTEGER,
        require: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        require: true,
      },
      first_price: {
        type: DataTypes.INTEGER,
        unique: false,
        require: true,
      },
      month_count: {
        type: DataTypes.INTEGER,
        unique: false,
        require: true,
      },

      first_date: {
        type: DataTypes.STRING,
        unique: false,
        require: true,
      },
      last_date: {
        type: DataTypes.STRING,
        unique: false,
        require: true,
      },
      final_price: {
        type: DataTypes.INTEGER,
        require: true,
      },
      insurance_paper: {
        type: DataTypes.STRING,
        require: true,
      },
    },
    {
      sequelize,
      modelName: "Process",
    }
  );
  return Process;
};
