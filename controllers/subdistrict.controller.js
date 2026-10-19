const subdistrictModel = require("../models").subdistrict;

// GET semua data kecamatan
exports.getAllSubdistrict = async (request, response) => {
    try {
        const data = await subdistrictModel.findAll();

        return response.status(200).json({
            success: true,
            message: "Data kecamatan berhasil diambil",
            data: data
        });

    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET berdasarkan ID
exports.getSubdistrictById = async (request, response) => {
    try {
        const id = request.params.id;

        const data = await subdistrictModel.findByPk(id);

        if (!data) {
            return response.status(404).json({
                success: false,
                message: "Data kecamatan tidak ditemukan"
            });
        }

        return response.status(200).json({
            success: true,
            message: "Detail kecamatan berhasil diambil",
            data: data
        });

    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// POST tambah data
exports.addSubdistrict = async (request, response) => {
    try {
        const {
            subdistrict_id,
            province_id,
            province,
            city_id,
            city,
            type,
            subdistrict_name
        } = request.body;

        const data = await subdistrictModel.create({
            subdistrict_id,
            province_id,
            province,
            city_id,
            city,
            type,
            subdistrict_name,
            created_at: new Date(),
            updated_at: new Date()
        });

        return response.status(201).json({
            success: true,
            message: "Data kecamatan berhasil ditambahkan",
            data: data
        });

    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// PUT ubah data
exports.updateSubdistrict = async (request, response) => {
    try {
        const id = request.params.id;

        const data = await subdistrictModel.findByPk(id);

        if (!data) {
            return response.status(404).json({
                success: false,
                message: "Data kecamatan tidak ditemukan"
            });
        }

        // Otomatis update waktu perubahan jika diperlukan
        const updateData = {
            ...request.body,
            updated_at: new Date()
        };

        await data.update(updateData);

        return response.status(200).json({
            success: true,
            message: "Data kecamatan berhasil diubah",
            data: data
        });

    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE data
exports.deleteSubdistrict = async (request, response) => {
    try {
        const id = request.params.id;

        const data = await subdistrictModel.findByPk(id);

        if (!data) {
            return response.status(404).json({
                success: false,
                message: "Data kecamatan tidak ditemukan"
            });
        }

        await data.destroy();

        return response.status(200).json({
            success: true,
            message: "Data kecamatan berhasil dihapus"
        });

    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.message
        });
    }
};