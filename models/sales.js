'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sales extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Sales.belongsTo(models.Manager, { foreignKey: 'manager_id', targetKey: 'manager_id' });
      Sales.belongsTo(models.Branch, { foreignKey: 'branch_id', targetKey: 'branch_id' });
      Sales.hasMany(models.Client, { foreignKey: 'sales_id', targetKey: 'sales_id' });

    }
  }
  Sales.init({
    sales_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      require: true
    },
    sales_name: {
      type: DataTypes.STRING,
      unique: true,
      require: true
    },
    manager_id: {
      type: DataTypes.INTEGER,
      require: true
    },
    branch_id: {
      type: DataTypes.INTEGER,
      require: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      require: true
    },
    password: {
      type: DataTypes.STRING,
      unique: true,
      require: true
    },
    national_id: {
      type: DataTypes.STRING,
      unique: false,
      require: true
    },
    phone: {
      type: DataTypes.STRING,
      require: true
    },
    sales_img: {
      type: DataTypes.STRING,
      require: true
    },
    face_national_id_img: {
      type: DataTypes.STRING,
      require: true
    },
    face_national_id_img: {
      type: DataTypes.STRING,
      require: true
    },
    back_national_id_img: {
      type: DataTypes.STRING,
      require: true
    },
    facebook_link: {
      type: DataTypes.STRING,
      require: true
    },
  }, {
    sequelize,
    modelName: 'Sales',
  });
  return Sales;
};