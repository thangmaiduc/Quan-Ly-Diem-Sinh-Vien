const { DataTypes } = require('sequelize');
const db = require('../db/db');


const Score = db.define('Score', {
  id:{
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  attadenceScore:{
    type: DataTypes.DECIMAL(4,2),
    defaultValue: 0,
    validate:{
      min: 0,
      max: 10
    }
  },
  homeworkScore:{
    type: DataTypes.DECIMAL(4,2),
    defaultValue: 0,
    validate:{
      min: 0,
      max: 10
    }
  },
  midtermScore:{
    type: DataTypes.DECIMAL(4,2),
    defaultValue: 0,
    validate:{
      min: 0,
      max: 10
    }
  },
  endtermScore:{
    type: DataTypes.DECIMAL(4,2),
    defaultValue: 0,
    validate:{
      min: 0,
      max: 10
    }
  },
},
{
  timestamps: false,
  tableName: 'scores',

})

module.exports = Score;