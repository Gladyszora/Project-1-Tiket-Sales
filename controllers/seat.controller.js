'use strict';

const db = require('../models');
const Seat = db.seat;

// GET semua seat
exports.getAllSeats = async (req, res) => {
    try {
        const seats = await Seat.findAll();

        return res.status(200).json({
            success: true,
            data: seats,
            message: "All seats have been loaded"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET seat berdasarkan ID
exports.getSeatById = async (req, res) => {
    try {
        const seat = await Seat.findByPk(req.params.id);

        if (!seat) {
            return res.status(404).json({
                success: false,
                message: "Seat not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: seat,
            message: "Seat has been loaded"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// POST tambah seat baru
exports.createSeat = async (req, res) => {
    try {
        const { eventID, rowNum, seatNum, status } = req.body;

        // Validasi input sederhana
        if (!eventID || !rowNum || !seatNum) {
            return res.status(400).json({
                success: false,
                message: "eventID, rowNum, dan seatNum wajib diisi"
            });
        }

        // Cek apakah nomor kursi di baris dan event tersebut sudah terdaftar
        const existingSeat = await Seat.findOne({
            where: { eventID, rowNum, seatNum }
        });

        if (existingSeat) {
            return res.status(400).json({
                success: false,
                message: "Nomor kursi pada baris dan event ini sudah ada"
            });
        }

        const seat = await Seat.create({
            eventID,
            rowNum,
            seatNum,
            status: status || 'available'
        });

        return res.status(201).json({
            success: true,
            data: seat,
            message: "Seat has been created"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// PUT update data seat
exports.updateSeat = async (req, res) => {
    try {
        const seat = await Seat.findByPk(req.params.id);

        if (!seat) {
            return res.status(404).json({
                success: false,
                message: "Seat not found"
            });
        }

        const { eventID, rowNum, seatNum, status } = req.body;

        await seat.update({
            eventID: eventID !== undefined ? eventID : seat.eventID,
            rowNum: rowNum !== undefined ? rowNum : seat.rowNum,
            seatNum: seatNum !== undefined ? seatNum : seat.seatNum,
            status: status !== undefined ? status : seat.status
        });

        return res.status(200).json({
            success: true,
            data: seat,
            message: "Data seat has been updated"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE hapus seat
exports.deleteSeat = async (req, res) => {
    try {
        const seat = await Seat.findByPk(req.params.id);

        if (!seat) {
            return res.status(404).json({
                success: false,
                message: "Seat not found"
            });
        }

        await seat.destroy();

        return res.status(200).json({
            success: true,
            message: "Data seat has been deleted"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};