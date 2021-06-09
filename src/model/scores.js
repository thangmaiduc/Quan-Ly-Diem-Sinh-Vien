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
  attadenceScorePercent:{
    type: DataTypes.DECIMAL(2,1),
    defaultValue: 0,
    validate:{
      min: 0,
      max: 1
    }
  },
  homeworkScorePercent:{
    type: DataTypes.DECIMAL(2,1),
    defaultValue: 0,
    validate:{
      min: 0,
      max: 1
    }
  },
  midtermScorePercent:{
    type: DataTypes.DECIMAL(2,1),
    defaultValue: 0,
    validate:{
      min: 0,
      max: 1
    }
  },
  endtermScorePercent:{
    type: DataTypes.DECIMAL(2,1),
    defaultValue: 0,
    validate:{
      min: 0,
      max: 1
    }
  },
  averageScore: {
    type: DataTypes.VIRTUAL,
    get() {
      return (this.attadenceScore*this.attadenceScorePercent + this.homeworkScore*this.homeworkScorePercent
      + this.midtermScore*this.midtermScorePercent + this.endtermScore*this.endtermScorePercent).toFixed(2) ;
    },
    set(value) {
      throw new Error('Do not try to set the `averageScore` value!');
    }
  }
},
{
  timestamps: false,
  tableName: 'scores',

})

module.exports = Score;