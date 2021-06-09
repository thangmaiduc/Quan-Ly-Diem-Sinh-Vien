const {Sequelize, DataTypes, QueryTypes } = require('sequelize');
const db = require('../db/db');
const validator = require('validator');

const Score = require('./scores')
const Subject = require('./subjects');
const Student = require('./students');


const StudentHasSubject = db.define('studentHasSubject',
{
    
    id: {
        type : DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
    
},
{
    tableName: 'student_has_subject',
   timestamps: false
});


StudentHasSubject.prototype.toJSON = function(){
    return {...this.get()}
}

module.exports = StudentHasSubject;