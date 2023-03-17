"use strict";
const { Model } = require("sequelize");
const { ValidationError } = require('@sequelize/core');
const { scheduler } = require("timers/promises");

const availableAirports = ["MIA", "JFK", "LAX"];

module.exports = (sequelize, DataTypes) => {
  class FlightSchedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FlightSchedule.init(
    {
      originAirport: {
        type: DataTypes.STRING,
        validate: {
          isIn: {
            args: [availableAirports],
            msg: "Invalid origin airport",
          },
        },
      },
      destinationAirport: {
        type: DataTypes.STRING,
        validate: {
          isIn: {
            args: [availableAirports],
            msg: "Invalid destination airport",
          },
        },
      },
      departureTime: {
        type: DataTypes.DATE,
        validate: {
          isDate: {
            args: true,
            msg: "Invalid departure time",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "FlightSchedule",
      validate: {
        validDestination() {
          const hasAirportValues =
            this.originAirport !== null && this.destinationAirport !== null;
          const invalidDestination =
            this.originAirport === this.destinationAirport;
          if (hasAirportValues && invalidDestination) {
            throw new Error(
              "The destination airport cannot be the same as the origin"
            );
          }
        },
      },
    }
  );

  async function createFlightSchedule() {
    try {
      await FlightSchedule.create({
        originAirport: 'JAX',
        destinationAirport: 'JFK',
        departureTime: '2030*101T00:00:00.000+00:00'
      })
      await scheduler.validate()
    } catch (err) {
      if(err instanceof ValidationError){
        console.log(err.errors)
      }else{
        console.log(err)
      }
    }
  }
  return FlightSchedule;
};
