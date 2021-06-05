const { DataTypes} = require('sequelize');
const db = require('../db/db');
const validator = require('validator');


const Subject = db.define('Subject',
{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
       
    },
    subjectName: {
        type: DataTypes.STRING,
        allowNull: false,
        
    },
    numOfCredit:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            isInt: true,
            min: 1
        }
    }
    
},
{
    tableName: 'subjects',
    timestamps: false
})

module.exports = Subject;