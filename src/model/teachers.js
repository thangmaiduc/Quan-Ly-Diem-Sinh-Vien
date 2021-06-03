const {DataTypes } = require('sequelize');
const db = require('../db/db');
const validator = require('validator');


const Teacher = db.define('Teacher',
{
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
       
    },
    
},
{
    tableName: 'teachers',
    timestamps: false
})

module.exports = Teacher;