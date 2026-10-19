/** load model */
const seatModel = require(`../models/index`).seat
const userModel = require(`../models/index`).user
const eventModel = require(`../models/index`).event
const ticketModel = require(`../models/index`).ticket

/** load instance sequelize untuk transaction */
const sequelize = require(`../models/index`).sequelize

/** create function for add new ticket */
exports.addTicket = async (request, response) => {
    //trying to debug
    console.log("Isi request.user:", request.user);
    
    const transaction = await sequelize.transaction();

    try {
        const { eventID, seats } = request.body;
        const userID = request.user?.userID || request.user?.id;

        if (!userID) {
            await transaction.rollback();
            return response.status(401).json({
                success: false,
                message: "User ID tidak ditemukan pada token. Silakan login ulang."
            });
        }

        if (!seats || !Array.isArray(seats) || seats.length === 0) {
            await transaction.rollback();
            return response.status(400).json({
                success: false,
                message: "Seats data must be a non-empty array"
            });
        }

        const bookedDate = new Date();

        // 1. Buat record kursi
        const seatIDs = await Promise.all(seats.map(async seat => {
            const { rowNum, seatNum } = seat;
            const createdSeat = await seatModel.create({
                eventID,
                rowNum,
                seatNum,
                status: 'true'
            }, { transaction });
            
            // Catatan: Jika primary key tabel seat di database Anda bernama 'id' (bukan seatID), 
            // ubah 'createdSeat.seatID' menjadi 'createdSeat.id'
            return createdSeat.seatID || createdSeat.id;
        }));

        // 2. Buat record tiket
        const ticketsData = seatIDs.map(seatID => ({
            eventID,
            userID,
            seatID,
            bookedDate
        }));

        const tickets = await ticketModel.bulkCreate(ticketsData, { transaction });

        await transaction.commit();

        return response.status(201).json({
            success: true,
            data: tickets,
            message: "Tickets successfully booked"
        });

    } catch (error) {
        await transaction.rollback();
        
        // <-- INI PENTING: Cetak error asli ke terminal Node.js agar terlihat penyebab error 500
        console.error("ERROR DI ADD TICKET:", error);

        return response.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
}

/** GET ALL TICKETS (Admin sees all, User sees their own history) */
exports.getAllTicket = async (request, response) => {
    try {
        const userID = request.user?.userID || request.user?.id;
        const userRole = request.user?.role?.toLowerCase();

        if (!userID) {
            return response.status(401).json({
                success: false,
                message: "User ID tidak terdeteksi dari token. Silakan login ulang."
            });
        }

        let queryOptions = {
            include: [
                { model: eventModel, attributes: ['eventName', 'eventDate', 'venue'] },
                { model: userModel, attributes: ['firstname', 'lastname', 'email'] },
                { model: seatModel, attributes: ['rowNum', 'seatNum'] },
            ]
        };

        // If the user is NOT an admin, restrict the query to only their own tickets
        if (userRole !== 'admin') {
            queryOptions.where = { userID: userID };
        }

        let tickets = await ticketModel.findAll(queryOptions);

        return response.json({
            success: true,
            data: tickets,
            message: userRole === 'admin' 
                ? "All system tickets loaded successfully (Admin)" 
                : "Your ticket history loaded successfully"
        });
    } catch (error) {
        console.error("ERROR DI GET ALL TICKET:", error);
        return response.status(500).json({
            success: false,
            message: error.message
        });
    }
}

/** GET TICKET BY TICKET ID */
exports.getTicketById = async (request, response) => {
    try {
        let ticketID = request.params.id;
        const currentUserID = request.user?.userID || request.user?.id;
        const userRole = request.user?.role?.toLowerCase();

        let ticket = await ticketModel.findByPk(ticketID, {
            include: [
                { model: eventModel, attributes: ['eventName', 'eventDate', 'venue'] },
                { model: userModel, attributes: ['firstname', 'lastname', 'email'] },
                { model: seatModel, attributes: ['rowNum', 'seatNum'] },
            ]
        });

        if (!ticket) {
            return response.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        // Security check: Regular users can only view their own specific ticket
        if (userRole !== 'admin' && ticket.userID !== currentUserID) {
            return response.status(403).json({
                success: false,
                message: "Akses ditolak. Anda hanya boleh melihat ticket milik sendiri."
            });
        }

        return response.json({
            success: true,
            data: ticket,
            message: "Ticket detail loaded successfully"
        });
    } catch (error) {
        console.error("ERROR DI GET TICKET BY ID:", error);
        return response.status(500).json({
            success: false,
            message: error.message
        });
    }
}