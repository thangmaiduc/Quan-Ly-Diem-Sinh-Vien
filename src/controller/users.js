const userModel = require('../model/users');
const studentModel = require('../model/students');
const teacherModel = require('../model/teachers');
const classModel = require('../model/classes');
const falcutyModel = require('../model/falcuties');
const StudentHasSubject = require('../model/student_has_subject');
const Subject = require('../model/subjects');


exports.getUsers=async (req, res, next)=>{
    
    try {
        const listUser = await userModel.findAll({});
        return res.status(200).json(listUser);
    } catch (error) {
        return res.status(200).json(error);
    }
}
exports.createUser=async (req, res, next)=>{
    const className= req.body.className;
    const falcutyName= req.body.falcutyName;
    try {
        const user = await userModel.create(req.body);
        if (user.role === 'student')
        {
            const _class = await classModel.findOne({where: {className}});
            
            if(!_class)
            {
                return res.status(404).json({error:{massage: "Class not exist "}});
            }
            else {
                await studentModel.create({userId: user.id, classId: _class.id});
                return res.status(201).json(user);
            }
        }else if(user.role === 'teacher'){
            const falcuty = await falcutyModel.findOne({where:{falcutyName}})
            
            if(!falcuty)
            {
                return res.status(404).json({error:{massage: "Falcuty not exist "}});
            }else{
                await teacherModel.create({userId: user.id, FalcutyId: falcuty.id});
                return res.status(201).json(user);
            }
        }else {

        }
        
    } catch (error) {
        return res.status(500).json(error);
    }
}



exports.getUsersRegSubject=async(req, res, next)=>{
    SubjectId = req.params.SubjectId;
    try {
        let listStudentRegSubject = await userModel.findAll({
            include:
            {
                model: studentModel,
                required: true,
                include:{
                    model: Subject,
                    required: true,
                    where:{
                        id: SubjectId
                    }
                }
            },
    });
        if(!listStudentRegSubject){
            
            return res.status(404).json({error:{massage: "Chua co khoa nao, hay toa them khoa"}});
            
        }else{
            
            return res.status(200).json(listStudentRegSubject);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}