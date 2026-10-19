// middlewares/auth-validation.js
const jwt = require('jsonwebtoken');

// Change this to match auth.controller.js
const SECRET_KEY = process.env.SECRET_KEY || "ticket_sales";

const authorize = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Akses ditolak! Token tidak ditemukan.'
            });
        }

        const decoded = jwt.verify(token, SECRET_KEY);

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'User ID tidak terdeteksi dari token. Silakan login ulang.'
        });
    }
};

const IsAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'Admin')) {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: 'Akses ditolak! Hanya Admin yang diizinkan.'
    });
};

const IsUser = (req, res, next) => {
    if (req.user && (req.user.role === 'user' || req.user.role === 'User')) {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: 'Akses ditolak! Hanya User yang diizinkan.'
    });
};

module.exports = {
    authorize,
    IsAdmin,
    IsUser
};