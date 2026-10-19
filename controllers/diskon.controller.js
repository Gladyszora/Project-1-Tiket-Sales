/** load model for `diskons` table */
const diskonModel = require("../models/index").diskon

/** GET semua data diskon */
exports.getAllDiskon = async (request, response) => {
    try {
        let diskon = await diskonModel.findAll()

        return response.json({
            success: true,
            data: diskon,
            message: "All discount has been loaded"
        })
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        })
    }
}

/** Tambah data diskon */
exports.addDiskon = async (request, response) => {
    try {
        let newDiskon = {
            nama_diskon: request.body.nama_diskon,
            nominal: request.body.nominal,
            tanggal_berlaku: request.body.tanggal_berlaku
        }

        let result = await diskonModel.create(newDiskon)

        return response.json({
            success: true,
            data: result,
            message: "New discount has been inserted"
        })
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        })
    }
}

/** Update data diskon */
exports.updateDiskon = async (request, response) => {
    try {
        let data = {
            nama_diskon: request.body.nama_diskon,
            nominal: request.body.nominal,
            tanggal_berlaku: request.body.tanggal_berlaku
        }

        await diskonModel.update(data, {
            where: {
                id_diskon: request.params.id
            }
        })

        return response.json({
            success: true,
            message: "Discount has been updated"
        })
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        })
    }
}

/** Hapus data diskon */
exports.deleteDiskon = async (request, response) => {
    try {
        await diskonModel.destroy({
            where: {
                id_diskon: request.params.id
            }
        })

        return response.json({
            success: true,
            message: "Discount has been deleted"
        })
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        })
    }
}