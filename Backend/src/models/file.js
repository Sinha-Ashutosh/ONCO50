'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  File.init({
    Filename: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    FileData: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'File',
  });
  return File;
};