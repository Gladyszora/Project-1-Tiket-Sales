'use strict';

const express = require('express');
const router = express.Router();

// Mengimpor controller seat
const seatController = require('../controllers/seat.controller');

// Middleware
const { authorize } = require('../middlewares/auth-validation');
const { IsUser, IsAdmin } = require('../middlewares/role-validation');

// =====================================================
// GET ALL SEATS
// =====================================================
router.get(
  '/',
  authorize,
  seatController.getAllSeats
);

// =====================================================
// GET SEAT DETAIL BY ID
// =====================================================
router.get(
  '/:id',
  authorize,
  seatController.getSeatById
);

// =====================================================
// CREATE SEAT (Admin Only)
// =====================================================
router.post(
  '/',
  authorize, IsAdmin,
  seatController.createSeat
);

// =====================================================
// UPDATE SEAT BY ID (Admin Only)
// =====================================================
router.put(
  '/:id',
  authorize, IsAdmin,
  seatController.updateSeat
);

// =====================================================
// DELETE SEAT BY ID (Admin Only)
// =====================================================
router.delete(
  '/:id',
  authorize, IsAdmin,
  seatController.deleteSeat
);

module.exports = router;