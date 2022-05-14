'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Boss extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Boss.init({
    boss_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      require: true
    },
    boss_name: {
      type: DataTypes.STRING,
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
      require: true
    },
  }, {
    sequelize,
    modelName: 'Boss',
  });
  return Boss;
};