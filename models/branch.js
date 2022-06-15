"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Branch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Branch.hasOne(models.Manager, {
        foreignKey: "branch_id",
        targetKey: "branch_id",
      });
      Branch.hasMany(models.Product, {
        foreignKey: "branch_id",
        targetKey: "branch_id",
      });
      Branch.hasMany(models.Sales, {
        foreignKey: "branch_id",
        targetKey: "branch_id",
      });
    }
  }
  Branch.init(
    {
      branch_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        require: true,
      },
      branch_name: {
        type: DataTypes.STRING,
        unique: true,
        require: true,
      },
      branch_address: {
        type: DataTypes.STRING,
        unique: true,
        require: true,
      },
      logo: {
        type: DataTypes.STRING,
        require: true,
      },
      isLock: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
    },
    {
      sequelize,
      modelName: "Branch",
    }
  );
  return Branch;
};
