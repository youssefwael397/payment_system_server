'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Manager extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Manager.belongsTo(models.Branch, { foreignKey: 'branch_id', targetKey: 'branch_id' });
    }
  }
  Manager.init({
    manager_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      require: true
    },
    manager_name: {
      type: DataTypes.STRING,
      unique: true,
      require: true
    },
    branch_id: {
      type: DataTypes.INTEGER,
      unique: true,
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
    manager_img: {
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
    isLock: {
      type: DataTypes.BOOLEAN,
      default: false,
    }
  }, {
    sequelize,
    modelName: 'Manager',
  });
  return Manager;
};