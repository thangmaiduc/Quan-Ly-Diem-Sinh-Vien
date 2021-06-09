var express = require("express");
var router = express.Router();
const StudentHasSubject = require("../model/student_has_subject");
const { authUser,authRole} = require("../middlewave/auth");
const Score = require("../model/scores");
const Subject = require("../model/subjects");
const CreditClass = require("../model/credit-class");
const { authGetCreditClass } = require("../middlewave/permissions");
const setCreditClass = async (req, res, next)=> {
  const scoreId = parseInt(req.params.scoreid);
  try {
    score = await Score.findByPk(scoreId);
    studentHasSubject =await StudentHasSubject.findByPk(score.studentHasSubjectId);
    req.creditClass = await CreditClass.findByPk(studentHasSubject.creditClassId);
    
    if (req.creditClass == null) {
      res.status(404)
      return res.send('Credit class not found')
    }
    next()
  } catch (error) {
    console.log(error);
    res.status(500).send('not allowed');
  }
}

// gv xem diem thanh phan cua 1 hs trong 1 lop tin chi
router.get('/scores/get/:scoreid',setCreditClass, authUser, authGetCreditClass,async (req, res, next)=>{
    const scoreId = req.params.scoreid;
    
    try {
      let scores = await Score.findByPk(scoreId);
      if(!scores)  {
        scores = await Score.create({id: scoreId});
      }
      return res.status(200).json(scores);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })
  // giao vien va admin set diem thanh phan cho 1 hs 
  router.put('/scores/edit/:scoreid',setCreditClass, authUser ,authGetCreditClass, async (req, res, next)=>{
    const scoreId = req.params.scoreid;
    
    try {
    
  
      await Score.update(req.body, {fields:["attadenceScore","homeworkScore","midtermScore","endtermScore"], where: {id:scoreId}});
      let scores = await Score.findByPk(scoreId);
  
      return res.status(200).json(scores);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })
  // giao vien  va admin set phan tram diem cua mot lop tin chi
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
  
   
// sinh vien xem diem
router.get('/scores/me', authUser , authRole('student'), async(req, res, next)=>{
  try {
    let listStudentCreditClassId=[];
    //liet ke tat ca lop tin chi ma sinh vien da tham gia
      listStudentCreditClass = await StudentHasSubject.findAll({where:{StudentUserId: req.user.id}});
      listStudentCreditClass.forEach(element => {
        listStudentCreditClassId.push(element.id)
      });
      console.log(listStudentCreditClassId);
//  diem cac lop ma sinh vien da tham gia
    const scoresOfSubject = await Subject.findAll({
      include:{
        model: CreditClass,
        required: true,
        include:{
          model: StudentHasSubject,
          required: true,
          include: {
            model: Score,
            required: true,
            where:{
              studentHasSubjectId : {$in : listStudentCreditClassId}
            },
            required: true,
          }
        }
      }
    }) 
    // const scores =await Score.findAll({where: {studentHasSubjectId : {$in : listStudentCreditClassId} }})
    if(scoresOfSubject.length === 0 ) return res.status(202).send(" Sinh vien chua tham gia bat ki lop tin chi nao");
    return res.status(200).json(scoresOfSubject)
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
})
  
    module.exports= router;