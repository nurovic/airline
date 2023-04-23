const { DateTime } = require("luxon")
const models = require('../models')
const res = require("express/lib/response")

async function createAirplane(req, res) {
    const {name, seats} = req.body

    try {
        const airplane = await models.Airplane.create({
            planeModel: name,
            totalSeats: seats
        })
        return res.json(airplane)
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.createAirplane = createAirplane

async function createSchedule(req,res) {
    const { airplaneId, origin, destination, departure } = req.body

    const dt = DateTime.fromISO(departure)

    if(!dt.isValid) {
        return res.status(400).send("airplne does not exist")
    }
    try {
        const plane = await models.Airplane.findByPk(airplaneId)
        if(!plane) {
            return req.status(404).send("airplane does not exist!")
        }
        const  flight  = await models.sequelize.transaction(async (tx) => {
            const schedule = await models.FlightSchedule.create({
                originAirport:origin,
                destinationAirport: destination,
                departure:dt
            }, {transaction: tx})
            await schedule.setAirplane(plane, { transaction: tx})
            return schedule
        })
        console.log("LLFGHT", flight)
        return res.json(flight)
    } catch (error) {
        return res.status(500).send(error)
    }
}

exports.createSchedule = createSchedule