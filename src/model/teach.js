const {Sequelize, DataTypes, QueryTypes } = require('sequelize');
const db = require('../db/db');
const validator = require('validator');

const Score = require('./scores')
const Subject = require('./subjects');
const Teacher = require('./teachers');
const Class = require('./classes');


const Teach = db.define('teach',
{
    
    
    
},
{
    tableName: 'teach',
   timestamps: false
});




module.exports = Teach;