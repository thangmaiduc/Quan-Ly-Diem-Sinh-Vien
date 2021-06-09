const { DataTypes } = require('sequelize');
const db = require('../db/db');
const validator = require('validator');



const CreditClass = db.define('creditClass',
{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }    
},
{
    tableName: 'credit-class',
   timestamps: false
});

CreditClass.prototype.toJSON = function(){
    return {...this.get()}
}


module.exports = CreditClass;