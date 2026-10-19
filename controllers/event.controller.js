/** load model for `events` table */
const eventModel = require(`../models/index`).event

/** load Operation from Sequelize */
const Op = require(`sequelize`).Op

/** load library 'path' and 'filestream' */
const path = require(`path`)
const fs = require(`fs`)

/** load function from `upload-image` */
const upload = require(`./upload-image`).single(`image`)

/** 1. Read all data */
exports.getAllEvent = async (request, response) => {
    try {
        let events = await eventModel.findAll()
        return response.json({
            success: true,
            data: events,
            message: `All Events have been loaded`
        })
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
}

/** 2. Filter data */
exports.findEvent = async (request, response) => {
    try {
        let keyword = request.params.key

        let events = await eventModel.findAll({
            where: {
                [Op.or]: [
                    { eventName: { [Op.substring]: keyword } },
                    { venue: { [Op.substring]: keyword } }
                ]
            }
        })

        return response.json({
            success: true,
            data: events,
            message: `Filtered events loaded`
        })
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
}

/** 3. Add new event */
exports.addEvent = (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.status(400).json({ success: false, message: error })
        }

        if (!request.file) {
            return response.status(400).json({ success: false, message: `Nothing to Upload` })
        }

        try {
            let newEvent = {
                eventName: request.body.eventName,
                eventDate: request.body.eventDate,
                venue: request.body.venue,
                price: request.body.price,
                image: request.file.filename
            }

            let result = await eventModel.create(newEvent)
            return response.status(201).json({
                success: true,
                data: result,
                message: `New event has been inserted`
            })
        } catch (err) {
            return response.status(500).json({
                success: false,
                message: err.message
            })
        }
    })
}

/** 4. Update event */
exports.updateEvent = async (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.status(400).json({ success: false, message: error })
        }

        let eventID = request.params.id

        try {
            // Cek apakah data event ditemukan sebelum diupdate
            const selectedEvent = await eventModel.findOne({ where: { eventID: eventID } })
            if (!selectedEvent) {
                return response.status(404).json({
                    success: false,
                    message: `Event with ID ${eventID} not found`
                })
            }

            let dataEvent = {
                eventName: request.body.eventName,
                eventDate: request.body.eventDate,
                venue: request.body.venue,
                price: request.body.price,
            }

            // Jika ada file baru yang diunggah, hapus gambar lama
            if (request.file) {
                const oldImage = selectedEvent.image
                if (oldImage) {
                    const pathImage = path.join(__dirname, `../image`, oldImage)
                    if (fs.existsSync(pathImage)) {
                        fs.unlinkSync(pathImage) // Menggunakan unlinkSync agar lebih aman dari race-condition
                    }
                }
                dataEvent.image = request.file.filename
            }

            await eventModel.update(dataEvent, { where: { eventID: eventID } })
            return response.json({
                success: true,
                message: `Data event has been updated`
            })
        } catch (err) {
            return response.status(500).json({
                success: false,
                message: err.message
            })
        }
    })
}

/** 5. Delete event */
exports.deleteEvent = async (request, response) => {
    try {
        const eventID = request.params.id
        const event = await eventModel.findOne({ where: { eventID: eventID } })

        if (!event) {
            return response.status(404).json({
                success: false,
                message: `Event with ID ${eventID} not found`
            })
        }

        // Hapus file gambar jika ada
        if (event.image) {
            const pathImage = path.join(__dirname, `../image`, event.image)
            if (fs.existsSync(pathImage)) {
                fs.unlinkSync(pathImage)
            }
        }

        await eventModel.destroy({ where: { eventID: eventID } })
        return response.json({
            success: true,
            message: `Data event has been deleted`
        })
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
}