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
Falcuty.prototype.toJSON = function(){
    return {...this.get(), createdAt: undefined, updatedAt: undefined}
};
Falcuty.getAllFalcuty = async() =>{
    teachers = await db.query("SELECT fal.id , falcutyName ,concat(firstName,' ',lastName) as fullName, sex  from `falcuties` fal left join `teachers` on id = falcutyId left join  `users`    on `users`.id = userId", { type: QueryTypes.SELECT });
    return teachers;
}
module.exports = Falcuty;