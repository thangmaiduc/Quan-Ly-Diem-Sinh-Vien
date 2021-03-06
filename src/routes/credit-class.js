var express = require("express");
var router =new express.Router();
const Subject = require("../model/subjects");
const StudentHasSubject = require("../model/student_has_subject");
const userModel = require("../model/users");
const studentModel = require("../model/students");
const { authUser,    authRole} = require("../middlewave/auth");
const Class = require("../model/classes");
const CreditClass = require('../model/credit-class');
const Score = require("../model/scores");
const Teacher = require("../model/teachers");
const { authGetCreditClass } = require("../middlewave/permissions");
const Falcuty = require("../model/falcuties");

const setCreditClass = async (req, res, next)=> {
  const creditClassId = parseInt(req.params.creditClassId);
  try {
    req.creditClass = await CreditClass.findByPk(creditClassId);
    if (req.creditClass == null) {
      res.status(404)
      return res.send('Credit class not found')
    }
    next()
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

router.get('/', async (req, res, next)=>{
  
  try {
    listClassCredit =await CreditClass.getAllCreditClass();
    res.status(200).json(listClassCredit)
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
})
// liet ke tat ca sinh vien trong 1 lop tin chi
router.get("/list-student/:creditClassId", setCreditClass, authUser,authGetCreditClass ,async (req, res, next) => {
   id = req.params.creditClassId ;
    TeacherUserId =req.user.id;
    try {
      let listStudentCreditClass = 
      await userModel.findAll({
        include: {
          model: studentModel,
          required: true,
          include: {
            model: StudentHasSubject,
            required: true,
            include:[{
              model: Score
            },{
              model: CreditClass,
              where: {
                id  

              },
            }]
             
          },
        }, attributes: {
          exclude: ['sex', 'role', 'email'],
        }
      });
      
      if (listStudentCreditClass.length === 0) {
        return res
          .status(404)
          .json({ error: { message: "Kh??ng c?? sinh n??o tham gia l???p h???c" } });
      } else {
        return res.status(200).json(listStudentCreditClass);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  });
  // chi tiet mon hoc -  liet ke tat ca lop tin chi cua giao vien 
router.get("/teacher/list-class-credit", authUser, authRole('teacher'), async (req, res, next) => {
    try {
      let listClassCredit = await Subject.findAll({
        include: {
          model:Class,
          required: true,
          through:{
            where:{
              TeacherUserId: req.user.id
            }
          }
        }
      })
  
      if (listClassCredit.length === 0) {
        return res
          .status(404)
          .json({ error: { message: "Gi??o vi??n ch??a ???????c x???p l???p n??o" } });
      } else {
        return res.status(200).json(listClassCredit);
      }
    } catch (error) {
      console.log(error); 
      return res.status(500).json(error);
    }
  });
router.put('/scores-percent/edit/:creditClassId',setCreditClass, authUser ,authGetCreditClass, async (req, res, next)=>{
    creditClassId = req.params.creditClassId ;
    try {
      let listStudentCreditClassId=[];
       //liet ke tat ca sinh vien da tham gia lop tin chi
      listStudentCreditClass = await StudentHasSubject.findAll({where:{creditClassId}});
      listStudentCreditClass.forEach(element => {
        listStudentCreditClassId.push(element.id)
      });
  
      await Score.update(req.body, {where: { studentHasSubjectId : { $in :listStudentCreditClassId }}});
    
      // return res.status(200).json(listStudentCreditClass);
      return res.status(200).send('Th??m ph???n tr??m ??i???m th??nh ph???n th??nh c??ng');
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }) 
// them lop tin chi
router.post('/add', authUser, authRole('admin') , async (req, res, next)=>{
  const {TeacherUserId,ClassId,SubjectId} = req.body;
  try {
    if(!TeacherUserId)
    {
      res.status(400).send("Gi??o vi??n kh??ng h???p l???")
    }
    else if(!ClassId)
    {
      res.status(400).send("L???p kh??ng h???p l???")
    }
    else if(!SubjectId)
    {
      res.status(400).send("M??n h???c kh??ng h???p l???")
    }
    await CreditClass.create(req.body);
    res.status(201).send('Th??m th??nh c??ng l???p t??n ch???')
  } catch (error) {
    res.status(500).send(error)
  }
});
router.get('/list-teacher-subject-class', authUser, authRole('admin') , async (req, res, next)=>{
  try {
   const classes =await Class.findAll({});
   let listTeacher= await userModel.findAll({
      
    include:{
    model: Teacher,
    required: true,
    include:{
      model: Falcuty,
      required: true
    }
  } ,
  } );
   const subjects =await Subject.findAll({});
   

   res.status(200).json({classes,listTeacher,subjects});
  } catch (error) {
    console.log(error);
    res.status(500).send(error)
  }
});
// xep gv cho 1 lop tin chi
router.put('/update', authUser, authRole('admin'), async (req, res, next)=>{
  id = req.body.id;
  TeacherUserId = req.body.TeacherUserId;
  try {
    await CreditClass.update({TeacherUserId}, {where:{id}});
    res.status(200).send('X???p gi??o vi??n cho l???p t??n ch??? th??nh c??ng')
  } catch (error) {
    console.log(error);
    res.status(500).send(error)
  }
});



  module.exports= router;