'use strict';

const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class subdistrict extends Model {

        static associate(models) {
            // Relasi bisa ditambahkan nanti jika diperlukan
        }
    }

    subdistrict.init({

        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },

        subdistrict_id: {
            type: DataTypes.STRING(20),
            allowNull: false
        },

        province_id: {
            type: DataTypes.STRING(20),
            allowNull: false
        },

        province: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        city_id: {
            type: DataTypes.STRING(20),
            allowNull: false
        },

        city: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        type: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        subdistrict_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        created_at: {
            type: DataTypes.DATE,
            allowNull: false
        },

        updated_at: {
            type: DataTypes.DATE,
            allowNull: false
        }

    }, {
        sequelize,
        modelName: 'subdistrict',
        tableName: 'subdistrict',
        timestamps: false
    });

    return subdistrict;
};