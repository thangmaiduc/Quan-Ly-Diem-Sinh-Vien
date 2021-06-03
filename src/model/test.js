const {Sequelize, DataTypes, QueryTypes } = require('sequelize');
const db = require('../db/db');


const User = db.define('user', {
    username: DataTypes.STRING,
    points: DataTypes.INTEGER
  }, { timestamps: false });
  const Profile = db.define('profile', {
    name: DataTypes.STRING
  }, { timestamps: false });
  const User_Profiles = db.define('User_Profile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    selfGranted: DataTypes.BOOLEAN
  }, { timestamps: false });
  User.belongsToMany(Profile, { through: User_Profiles, uniqueKey:['id','selfGranted']});
  db.sync().then();