const { Sequelize,DataTypes, Model, Op, QueryTypes   } = require('sequelize');
const db = new Sequelize(process.env.DB_NAME , process.env.DB_USERNAME, process.env.DB_PASSWORD , {
  host: process.env.HOST   ,
  dialect:'mysql',
  define: {
    freezeTableName: true
  },
  operatorsAliases:{
    $gt: Op.gt,
    $in: Op.in,
    $lt: Op.lt,
    $like: Op.like,
    $notlike: Op.notLike
  }
});




test = async() =>{
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.'+ process.env.HOST );
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