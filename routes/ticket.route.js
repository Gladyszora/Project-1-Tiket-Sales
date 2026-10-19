const express = require('express');
const router = express.Router();

const ticketController = require('../controllers/ticket.controller');

// Middleware
const { authorize } = require('../middlewares/auth-validation');
const { IsUser, IsAdmin} = require('../middlewares/role-validation');

// =====================================================
// GET ALL TICKETS 
// - Admin: Sees all tickets in the database
// - User: Sees only their own ticket history
// =====================================================
router.get(
  '/',
  authorize, IsAdmin, 
  ticketController.getAllTicket
);

// =====================================================
// GET TICKET DETAIL BY TICKET ID
// =====================================================
router.get(
  '/:id', 
  authorize, IsAdmin,
  ticketController.getTicketById
);

// =====================================================
// BOOK / ADD TICKET
// =====================================================
router.post(
  '/',
  authorize, IsUser, 
  ticketController.addTicket
);

module.exports = router;