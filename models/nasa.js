'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Nasa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Nasa.init({
    url: DataTypes.STRING,
    sol: DataTypes.STRING,
    earth_date: DataTypes.STRING,
    mail: DataTypes.STRING,
    img_id: DataTypes.STRING,
    camera: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Nasa',
  });
  return Nasa;
};