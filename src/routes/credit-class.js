var express = require("express");
var router = express.Router();
const Subject = require("../model/subjects");
const StudentHasSubject = require("../model/student_has_subject");
const userModel = require("../model/users");
const studentModel = require("../model/students");
const { authUser,    authRole} = require("../middlewave/auth");
const Class = require("../model/classes");
const CreditClass = require('../model/credit-class');
const Score = require("../model/scores");
const { authGetCreditClass } = require("../middlewave/permissions");

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
          .json({ error: { massage: "Chua co sinh vien nao tham gia lop hoc" } });
      } else {
        return res.status(200).json(listStudentCreditClass);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  });
  // chi tiet mon hoc -  liet ke tat ca lop tin chi cua giao vien 
router.get("/teacher/list-class-credit", authUser,authRole('teacher'), authGetCreditClass, async (req, res, next) => {
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
          .json({ error: { massage: "Giao vien chua duoc xep lop nao" } });
      } else {
        return res.status(200).json(listClassCredit);
      }
    } catch (error) {
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
      return res.status(200).send('Them phan tram diem thanh cong ');
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }) 
// them lop tin chi
router.post('/add', authUser, authRole('admin') , async (req, res, next)=>{
  try {
    await CreditClass.create(req.body);
    res.status(201).send('them thanh cong lop tin chi')
  } catch (error) {
    res.status(500).send(error)
  }
});
// xep gv cho 1 lop tin chi
router.put('/update', authUser, authRole('admin'), async (req, res, next)=>{
  ClassId = req.body.ClassId;
  SubjectId = req.body.SubjectId;
  TeacherUserId = req.body.TeacherUserId;
  try {
    await CreditClass.update({TeacherUserId}, {where:{ClassId, SubjectId}});
    res.status(200).send('xep giao vien cho lop tin chi thanh cong')
  } catch (error) {
    console.log(error);
    res.status(500).send(error)
  }
});



  module.exports= router;