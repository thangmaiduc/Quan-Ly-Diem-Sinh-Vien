const {Sequelize, DataTypes, QueryTypes } = require('sequelize');
const db = require('../db/db');
const validator = require('validator');


const Class = db.define('Class',
{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    className: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        
    },
    createdAt:{
        type: DataTypes.DATE,
    },
    updatedAt:{
        type: DataTypes.DATE
    }
},
{
    tableName: 'classes',
    timestamps: true
})
Class.prototype.toJSON = function(){
    return {...this.get(), createdAt: undefined, updatedAt: undefined, FalcutyId: undefined}
};
module.exports = Class;