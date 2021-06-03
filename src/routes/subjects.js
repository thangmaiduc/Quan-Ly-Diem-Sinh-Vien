var express = require('express');
var router = express.Router();
const Subject = require('../model/subjects');

const Student = require('../model/students');


/* GET users listing. */


router.post('/', async(req, res, next)=>{
    const subjectName = req.body.subjectName;
    
    try {
        let subject = await Subject.findOne({where:{ subjectName}});
        
        if(!subject){
            
            subject =await Subject.create(req.body);
            return res.status(200).json(falcuty);
        }else{
            return res.status(400).json({error:{massage: "Subject has already exist "}});
        }
    } catch (error) {
        return res.status(500).json(error);
    }
})

router.get('/', async(req, res, next)=>{
   
    
    try {
        let subjects = await Subject.findAll();
        
        if(!subjects){
            
            return res.status(404).json({error:{massage: "Chua co khoa nao, hay toa them khoa"}});
            
        }else{
            
            return res.status(200).json(subjects);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
})


module.exports = router;