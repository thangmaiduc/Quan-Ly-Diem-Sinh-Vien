var express = require('express');
var router = express.Router();
const classModel = require('../model/classes');
const falcutyModel = require('../model/falcuties');
const studentModel = require('../model/students');
const userModel = require('../model/users');


/* GET users listing. */
router.get('/', async(req, res, next)=>{
    try {
        let classes = await classModel.findAll();
        
        if(!classes){
            
            return res.status(404).json({error:{massage: "Chua co khoa nao, hay toa them khoa"}});
            
        }else{
            
            return res.status(200).json(classes);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
})
router.get('/:search', async(req, res, next)=>{
    const search = req.params.search;
    try {
        let classes = await classModel.findAll({where: { className: {
            $like : '%'+search+'%'
        }}});
        
        if(!classes){
            
            return res.status(404).json({error:{massage: "Chua co khoa nao, hay toa them khoa"}});
            
        }else{
            
            return res.status(200).json(classes);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
})
router.get('/student/:classId', async(req, res, next)=>{
    const classId = req.params.classId;
    try {
        let listStudent = await userModel.findAll({ include: {model: studentModel, where: { classId}} });
        
        if(!listStudent){
            
            return res.status(404).json({error:{massage: "Chua co khoa nao, hay toa them khoa"}});
            
        }else{
            
            return res.status(200).json(listStudent);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
})


router.post('/', async(req, res, next)=>{
    const className = req.body.className;
    const falcutyName = req.body.falcutyName;
    try {
        let _class = await classModel.findOne({where:{ className}});
        const falcuty = await falcutyModel.findOne({where:{ falcutyName}})
        if(!_class && falcuty){
            
             _class =await classModel.create({className,FalcutyId: falcuty.id});
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
})

module.exports = router;