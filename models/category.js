'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.belongsTo(models.Branch, { foreignKey: 'branch_id', targetKey: 'branch_id' });
    }
  }
  Category.init({
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      require: true
    },
    category_name: {
      type: DataTypes.STRING,
      unique: false,
      require: true
    },
    branch_id: {
      type: DataTypes.INTEGER,
      require: true
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};