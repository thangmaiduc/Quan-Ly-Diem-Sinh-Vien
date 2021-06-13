const {DataTypes, QueryTypes } = require('sequelize');
const db = require('../db/db');
const validator = require('validator');
const User = require('./users');

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
// Teacher.prototype.toJSON = function(){
//     return undefined
// }
Teacher.getAllTeacher = async() =>{
    teachers = await db.query("SELECT id ,  concat(firstName,' ',lastName) as fullName, sex  from `users` join  `teachers` on id = userId", { type: QueryTypes.SELECT })
    return teachers;
}

module.exports = Teacher;