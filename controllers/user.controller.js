// controllers/user.controller.js
const { user: User } = require('../models');
const md5 = require('md5');
const jwt = require('jsonwebtoken'); // Pastikan library jsonwebtoken terinstal

// Kunci rahasia JWT (Sesuaikan dengan yang Anda gunakan di middleware/auth)
const SECRET_KEY = process.env.SECRET_KEY || "ticket_sales";

// ====================== AUTH / LOGIN ======================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email dan password wajib diisi' 
      });
    }

    // Cari user berdasarkan email dan password yang di-hash dengan md5
    const user = await User.findOne({
      where: {
        email: email,
        password: md5(password)
      }
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email atau password salah' 
      });
    }

    // Buat data payload untuk token (menyimpan id/userID dan role)
    const dataToken = {
      id: user.userID || user.id, // Menyesuaikan primary key database Anda
      email: user.email,
      role: user.role,
      firstname: user.firstname,
      lastname: user.lastname
    };

    // Generate token JWT (berlaku 24 jam)
    const token = jwt.sign(dataToken, SECRET_KEY, { expiresIn: '24h' });

    return res.status(200).json({
      success: true,
      message: 'Login berhasil',
      token: token,
      data: {
        id: user.userID || user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ====================== GET ======================
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================== CREATE ======================
const createUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    const newUser = await User.create({
      firstname,
      lastname,
      email,
      password: md5(password),
      role: role || 'user'
    });

    const { password: _, ...userWithoutPassword } = newUser.toJSON();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const register = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    const newUser = await User.create({
      firstname,
      lastname,
      email,
      password: md5(password),
      role: 'user'
    });

    const { password: _, ...userWithoutPassword } = newUser.toJSON();

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================== UPDATE ======================
const updateUser = async (req, res) => {
  try {
    const targetId = parseInt(req.params.id);
    const isAdmin = req.user.role === 'admin';

    const user = await User.findByPk(targetId);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const { firstname, lastname, email, password, role } = req.body;

    // Cek email unik
    if (email && email !== user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({ message: 'Email sudah digunakan' });
      }
    }

    const dataUpdate = {
      firstname: firstname ?? user.firstname,
      lastname: lastname ?? user.lastname,
      email: email ?? user.email
    };

    // Hanya admin yang boleh ubah role
    if (isAdmin && role !== undefined) {
      dataUpdate.role = role;
    }

    if (password) {
      dataUpdate.password = md5(password);
    }

    await user.update(dataUpdate);

    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.status(200).json({
      success: true,
      message: 'Data berhasil diperbarui',
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMe = async (req, res) => {
  try {
    // Mendukung req.user.id maupun req.user.userID agar tidak undefined
    const currentUserId = req.user?.id || req.user?.userID;

    const user = await User.findByPk(currentUserId);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const { firstname, lastname, email, password } = req.body;

    if (email && email !== user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({ message: 'Email sudah digunakan' });
      }
    }

    const dataUpdate = {
      firstname: firstname ?? user.firstname,
      lastname: lastname ?? user.lastname,
      email: email ?? user.email
    };

    if (password) {
      dataUpdate.password = md5(password);
    }

    await user.update(dataUpdate);

    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.status(200).json({
      success: true,
      message: 'Data berhasil diperbarui',
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password baru wajib diisi' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    await user.update({ password: md5(password) });

    res.status(200).json({
      success: true,
      message: 'Password berhasil direset'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================== DELETE ======================
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    await user.destroy();
    res.status(200).json({ message: `User id ${req.params.id} berhasil dihapus` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateMe,
  deleteUser,
  register,
  resetPassword,
  login // <-- Jangan lupa diexport agar bisa dipasang di file routes
};