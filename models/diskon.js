'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class diskon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // definisikan relasi di sini jika ada
    }
  }

  diskon.init({
    id_diskon: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nama_diskon: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nominal: {
      type: DataTypes.DOUBLE, // Gunakan INTEGER jika nominal selalu bulat (misal: Rp 10.000)
      allowNull: false
    },
    tanggal_berlaku: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'diskon',
  });

  return diskon;
};