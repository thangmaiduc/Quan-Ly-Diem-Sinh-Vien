var express = require('express');
var router = express.Router();
const Class = require('../model/classes');
const Falcuty = require('../model/falcuties');
const Student = require('../model/students');
const User = require('../model/users');


/* liet ke tat ca lop hoc. */
router.get('/', async(req, res, next)=>{
    try {
        let classes = await Class.findAll();
        
        if(!classes){
            
            return res.status(404).json({error:{massage: "Chua co khoa nao, hay toa them khoa"}});
            
        }else{
            
            return res.status(200).json(classes);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
})
// tim lop hoc bang tu khoa search
/**
 * @swagger
 *
 * /classes/search={search}:
 *   get:
 *     produces:
 *       - application/json
 */
router.get('/search=:search', async(req, res, next)=>{
    const search = req.params.search;
    try {
        let classes = await Class.findAll({where: { className: {
            $like : '%'+search+'%'
        }}});
        
        if(classes.length===0){
            
            return res.status(404).json({error:{massage: "Khong tim thay lop hoc nao co ten: "+ search}});
            
        }else{
            
            return res.status(200).json(classes);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
})

// lay danh sach hoc sinh bang class id
router.get('/list-student/:classId', async(req, res, next)=>{
    const classId = req.params.classId;
    try {
        let listStudent = await User.findAll({ include: {model: Student, where: { classId}} });
        
        if(!listStudent){
            
            return res.status(404).json({error:{massage: "Chua co khoa nao, hay toa them khoa"}});
            
        }else{
            
            return res.status(200).json(listStudent);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
})

// them lop hoc
router.post('/add-class', async(req, res, next)=>{
    const className = req.body.className;
    const falcutyName = req.body.falcutyName;
    try {
        let _class = await Class.findOne({where:{ className}});
        const falcuty = await Falcuty.findOne({where:{ falcutyName}})
        if(!_class && falcuty){
            
             _class =await Class.create({className,FalcutyId: falcuty.id});
            return res.status(200).json(_class);
        }else if(!falcuty){
            return res.status(404).json({error:{massage: "falcuty not exist "}});
        }
        else{
            return res.status(400).json({error:{massage: "Class has already exist "}});
        }
    } catch (error) {
        return res.status(500).json(error);
    }
});
//xoa lop hoc bang id
router.delete("/delete.:id", async (req, res, next) => {
    id = req.params.id;
    try {
          const _class = await Class.findByPk(id);
          if(!_class) return res.status(404).send('Khong tim thay lop hoc can xoa');
          await Class.destroy({where: {id}})
          return res.status(200).send('Xoa lop hoc thanh cong');
      
    } catch (error) {
        console.log(error);
      return res.status(500).json(error);
    }
  });

module.exports = router;