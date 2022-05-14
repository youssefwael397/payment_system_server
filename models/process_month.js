'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Process_Month extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Process.belongsTo(models.Client, { foreignKey: 'client_id', targetKey: 'client_id' });
      Process_Month.belongsTo(models.Process, { foreignKey: 'process_id', targetKey: 'process_id' });
    }
  }
  Process_Month.init({
    process_month_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      require: true
    },
    process_id: {
      type: DataTypes.INTEGER,
      require: true
    },
    date: {
      type: DataTypes.STRING,
      require: true
    },
    price: {
      type: DataTypes.INTEGER,
      require: true
    },
    is_cashed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      require: true
    },
  }, {
    sequelize,
    modelName: 'Process_Month',
  });
  return Process_Month;
};