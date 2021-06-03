const { Sequelize,DataTypes, Model, Op, QueryTypes   } = require('sequelize');
const db = new Sequelize('qlsv2', 'qlsv', '12345', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    freezeTableName: true
  },
  operatorsAliases:{
    $gt: Op.gt,
    $lt: Op.lt,
    $like: Op.like,
    $notlike: Op.notLike
  }
});




test = async() =>{
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
 test();
module.exports=db ;











// var mysql      = require('mysql');
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'qlsv',
//   password : '12345',
//   database: 'qlsv'
// });
 
// var getConnection = connection.connect(function(err) {
//   if (err) {
//     console.error('error connecting: ' + err.stack);
//     return;
//   }
 
//   console.log('connected as id ' + connection.threadId);
 
// });




// module.exports = connection;