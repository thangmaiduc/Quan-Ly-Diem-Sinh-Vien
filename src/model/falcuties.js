const {Sequelize, DataTypes, QueryTypes } = require('sequelize');
const db = require('../db/db');
const validator = require('validator');



const Falcuty = db.define('Falcuty',
{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    falcutyName: {
        type: DataTypes.STRING,
        allowNull: false,
        
         
    },
    createdAt:{
        type: DataTypes.DATE,
    },
    updatedAt:{
        type: DataTypes.DATE
    }
},
{
    tableName: 'falcuties',
    timestamps: true
})

module.exports = Falcuty;