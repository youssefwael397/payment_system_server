'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Client.belongsToMany(models.Process, { through: 'client_process', foreignKey: 'client_id', otherKey: 'process_id' });
      Client.belongsTo(models.Sales, { foreignKey: 'sales_id', targetKey: 'sales_id' });


    }
  }
  Client.init({
    client_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      require: true
    },
    sales_id: {
      type: DataTypes.INTEGER,
      unique: true,
      require: true
    },
    client_name: {
      type: DataTypes.STRING,
      unique: false,
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
    work: {
      type: DataTypes.STRING,
      require: true
    },
    home_address: {
      type: DataTypes.STRING,
      require: true
    },
    work_address: {
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
    is_blocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      require: true
    },
  }, {
    sequelize,
    modelName: 'Client',
  });
  return Client;
};