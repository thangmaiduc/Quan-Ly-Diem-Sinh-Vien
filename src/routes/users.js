var express = require("express");
var router = express.Router();
const userModel = require("../model/users");
const studentModel = require("../model/students");
const teacherModel = require("../model/teachers");
const classModel = require("../model/classes");
const falcutyModel = require("../model/falcuties");
const Subject = require("../model/subjects");
const jwt = require("jsonwebtoken");
const { authUser, authRole } = require("../middlewave/auth");


router.get("/", authUser, authRole('admin') , async (req, res, next) => {
  try {
    const listUser = await userModel.findAll({});
    return res.status(200).json(listUser);
  } catch (error) {
    return res.status(200).json(error);
  }
});

router.get("/profile/me", authUser , async (req, res, next) => {
  try{
    const user = await userModel.findByPk(req.user.id);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(200).json(error);
  }
});

const encodeToken = (userId, role) => {
  
  const token = jwt.sign(
    { id: userId, role},
    process.env.JWT_SECRET,
     {expiresIn:'3 days'}
  );

  return token;
};


router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findByCredentials(email, password);
    if(!user) {
      res.status(404).json({ error: { massage: "Email and Password is invalid" } });
    }
    const token = encodeToken(user.id);
    res.setHeader("authToken", token);
    res.status(200).json({user, token});
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

router.post("/add-user",authUser, authRole('admin'), async (req, res, next) => {
  const classId = req.body.classId;
  const falcutyId = req.body.falcutyId;
  try {
    const user = await userModel.build(req.body);
    

    if (user.role === "student") {
      const _class = await classModel.findOne({ where: { id:classId } });

      if (!_class) {
        return res.status(404).json({ error: { massage: "Class not exist " } });
      } else {
        await user.save();
        await studentModel.create({ userId: user.id, classId: classId });
        return res.status(201).json(user);

      }
    } else if (user.role === "teacher") {
      const falcuty = await falcutyModel.findOne({ where: { id:falcutyId } });
      if (!falcuty) {
        return res
          .status(404)
          .json({ error: { massage: "Falcuty not exist " } });
      } else {
        await user.save();
    
        await teacherModel.create({ userId: user.id, FalcutyId: falcutyId });
        return res.status(201).json(user);
      }
    }
    else
    {
      await user.save();
    return res.status(201).json(user);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});
router.post("/bulk-add-students.:classId",authUser, authRole('admin'), async (req, res, next) => {
  const classId = req.params.classId;
  try {
      const _class = await classModel.findOne({ where: { id:classId } });
      if (!_class) {
        return res.status(404).json({ error: { massage: "Class not exist " } });
      } else {
        req.body.forEach(async(ele) => {
          const user = await userModel.create(ele);
          await studentModel.create({userId: user.id, classId })
        });
        
        return res.status(201).send("them danh sach thanh cong");
      }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

module.exports = router;
