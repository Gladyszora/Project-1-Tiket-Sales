const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

// Middleware
const { authorize } = require('../middlewares/auth-validation');
const { validateUser } = require('../middlewares/user-validation');
const { IsAdmin, IsUser } = require('../middlewares/role-validation');

// =====================================================
// GET ALL USERS
// Hanya Admin
// =====================================================
router.get('/', [authorize, IsAdmin], userController.getUsers
);

// =====================================================
// REGISTER
// Tidak membutuhkan token
// =====================================================
router.post(
  '/register',
  validateUser,
  userController.register
);

// =====================================================
// TAMBAH USER
// Hanya Admin
// =====================================================
router.post(
  '/',
  [authorize, IsAdmin, validateUser],
  userController.createUser
);

// =====================================================
// UPDATE DATA DIRI SENDIRI
// =====================================================
router.put(
  '/me',
  authorize,
  userController.updateMe
);

// =====================================================
// RESET PASSWORD
// Hanya Admin
// =====================================================
router.put(
  '/reset/:id',
  [authorize, IsAdmin],
  userController.resetPassword
);

// =====================================================
// GET USER BY ID
// =====================================================
router.get(
  '/:id',
  authorize,
  userController.getUserById
);

// =====================================================
// UPDATE USER BY ID
// =====================================================
router.put(
  '/:id',
  [authorize, validateUser],
  userController.updateUser
);

// =====================================================
// DELETE USER
// Hanya Admin
// =====================================================
router.delete(
  '/:id',
  [authorize, IsAdmin],
  userController.deleteUser
);

module.exports = router;