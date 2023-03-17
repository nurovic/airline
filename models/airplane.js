"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Airplane extends Model {
    static associate(models) {
      // define association here
    }
  }
  Airplane.init({
    planeModel: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Plane types should not be empty'
        }
      }
    },
    totalSeats: {
      type: DataTypes.INTEGER,
      validate: {
        min: {
          args: 1,
          msg: 'A plane must have at least one seat'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Airplane',
  });
  return Airplane;
};
