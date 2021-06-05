var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./db/db');
var indexRouter = require('./routes/index');
var subjectRouter = require('./routes/subjects');
var usersRouter = require('./routes/users');
var classesRouter = require('./routes/classes');
var falcutiesRouter = require('./routes/falcuties');var session = require('express-session');


const userModel = require('./model/users') ;
const studentModel = require('./model/students') ;
const teacherModel = require('./model/teachers') ;
const classModel = require('./model/classes') ;
const falcutyModel = require('./model/falcuties') ;
const studentHasSubject = require('./model/student_has_subject') ;
const subjectModel = require('./model/subjects') ;
const teachModel = require('./model/teach') ;

// const swaggerJsDoc = require('swagger-jsdoc');
// const swaggerUiExpress = require('swagger-ui-express');
var app = express();

// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Manager Student API',
//       version: '1.0.0',
//     },
//     servers:[
//       {
//         url: 'http://localhost:3000'
//       }
//     ]
//   },
//   apis: ['./src/routes/*.js'], // files containing annotations as above
// };

// const spec = swaggerJsDoc(options);
// app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/classes', classesRouter);
app.use('/falcuties', falcutiesRouter);
app.use('/subjects', subjectRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in 
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

userModel.hasOne(studentModel, {foreignKey: 'userId', onDelete: 'CASCADE'});
userModel.hasOne(teacherModel, {foreignKey: 'userId', onDelete: 'CASCADE'});


studentModel.belongsTo(classModel,{ foreignKey: 'classId'});
classModel.hasMany(studentModel, { foreignKey: 'classId', constraints: true, onDelete: 'CASCADE'});

classModel.belongsTo(falcutyModel, { foreignKey: {allowNull:false,},  onDelete: 'CASCADE'});
falcutyModel.hasMany(classModel);

teacherModel.belongsTo(falcutyModel, { foreignKey: {allowNull:false,},  onDelete: 'CASCADE'});
falcutyModel.hasMany(teacherModel);

studentModel.belongsToMany(subjectModel,{through: studentHasSubject});
subjectModel.belongsToMany(studentModel,{through: studentHasSubject});

teacherModel.belongsToMany(subjectModel, {through: teachModel})
subjectModel.belongsToMany(teacherModel, {through: teachModel})

classModel.belongsToMany(teacherModel, {through: teachModel})
teacherModel.belongsToMany(classModel, {through: teachModel})

classModel.belongsToMany(subjectModel, { through: teachModel})
subjectModel.belongsToMany(classModel, { through: teachModel})

teacherModel.hasMany(teachModel, { onDelete: 'CASCADE'});
teachModel.belongsTo(teacherModel);

subjectModel.hasMany(teachModel, {onDelete: 'CASCADE'});
teachModel.belongsTo(subjectModel);

classModel.hasMany(teachModel, { onDelete: 'CASCADE'});
teachModel.belongsTo(classModel);



db.sync()
  .then()
  .catch(err=>{
    console.log(err);
    console.log('Syncing database was fail');
  })
module.exports = app;
