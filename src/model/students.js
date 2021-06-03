const Class = require('./classes');
const {Sequelize, DataTypes, QueryTypes } = require('sequelize');
const User = require('./users')
const db = require('../db/db');
const validator = require('validator');




const Student = db.define('Student',
{
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
       
    },
    classId: {
        type: DataTypes.INTEGER,
        allowNull: false,

    },
    
},
{
    tableName: 'Students',
   timestamps: false
});




module.exports = Student;