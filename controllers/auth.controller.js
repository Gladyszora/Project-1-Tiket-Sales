const md5 = require('md5');
const jwt = require('jsonwebtoken');

/** load model user */
const userModel = require('../models/index').user;

/** secret key untuk JWT */
const secretKey = process.env.SECRET_KEY || "ticket_sales";

/** authentication / login */
const authenticate = async (request, response) => {
  try {
    const { email, password } = request.body;

    // Validasi input
    if (!email || !password) {
      return response.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi'
      });
    }

    /** cari user berdasarkan email dan password */
    const dataUser = await userModel.findOne({
      where: {
        email: email,
        password: md5(password)
      }
    });

    /** jika user tidak ditemukan */
    if (!dataUser) {
      return response.status(401).json({
        success: false,
        logged: false,
        message: 'Authentication Failed. Invalid email or password'
      });
    }

    /** ambil data user & buang password */
    const userData = dataUser.toJSON();
    delete userData.password; // penting! jangan kirim password

    /** buat token (tanpa password) */
    const token = jwt.sign(
      {
        // KODE BARU / DISESUAIKAN: Menambahkan userID agar tersimpan ke dalam JWT
        userID: userData.userID || userData.id, 
        email: userData.email,
        role: userData.role,
        firstname: userData.firstname,
        lastname: userData.lastname
      },
      secretKey,
      { expiresIn: '1d' } // token berlaku 1 hari
    );

    return response.json({
      success: true,
      logged: true,
      message: 'Authentication Success',
      token: token,
      data: userData
    });

  } catch (error) {
    console.error(error);

    return response.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

module.exports = {
  authenticate
};