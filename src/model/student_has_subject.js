const {Sequelize, DataTypes, QueryTypes } = require('sequelize');
const db = require('../db/db');
const validator = require('validator');

const Score = require('./scores')
const Subject = require('./subjects');
const Student = require('./students');


const StudentHasSubject = db.define('StudentHasSubject',
{
    
    scoreId: {
        type : DataTypes.INTEGER,
        unique: true,
        references:{
            model: Score,
            key: 'id'
        },
       
    }
    
},
{
    tableName: 'student_has_subject',
   timestamps: false
});




module.exports = StudentHasSubject;