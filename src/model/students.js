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
    tableName: 'students',
   timestamps: false
});

Student.prototype.toJSON = function(){
    return {...this.get(), userId: undefined, classId: undefined}
}


module.exports = Student;