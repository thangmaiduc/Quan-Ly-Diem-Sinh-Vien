var express = require("express");
var router = express.Router();
const userModel = require("../model/users");
const studentModel = require("../model/students");
const teacherModel = require("../model/teachers");
const classModel = require("../model/classes");
const falcutyModel = require("../model/falcuties");
const Subject = require("../model/subjects");
const jwt = require("jsonwebtoken");
const { authUser } = require("../middlewave/auth");


router.get("/", async (req, res, next) => {
  try {
    const listUser = await userModel.findAll({});
    return res.status(200).json(listUser);
  } catch (error) {
    return res.status(200).json(error);
  }
});

const encodeToken = (userId, role) => {
  const token = jwt.sign(
    { id: userId, role, exp: 259200 },
    process.env.JWT_SECRET
  );

  return token;
};

router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ where: { email }, });
    if (!user) {
      res.status(404).json({ error: { massage: "Email is not exist" } });
    } else {
      if (user.password !== password) {
        res.status(400).json({ error: { massage: "Password is invalid" } });
      } else {
       
        const token = encodeToken(user.id);

        res.setHeader("Authorization", token);
        res.status(200).json({ user });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/add-user", async (req, res, next) => {
  const className = req.body.className;
  const falcutyName = req.body.falcutyName;
  try {
    const user = await userModel.create(req.body);
    token = encodeToken(user.id);
    res.header("authToken", token);

    if (user.role === "student") {
      const _class = await classModel.findOne({ where: { className } });

      if (!_class) {
        return res.status(404).json({ error: { massage: "Class not exist " } });
      } else {
        await studentModel.create({ userId: user.id, classId: _class.id });
        return res.status(201).json(user);
      }
    } else if (user.role === "teacher") {
      const falcuty = await falcutyModel.findOne({ where: { falcutyName } });

      if (!falcuty) {
        return res
          .status(404)
          .json({ error: { massage: "Falcuty not exist " } });
      } else {
        await teacherModel.create({ userId: user.id, FalcutyId: falcuty.id });
        return res.status(201).json(user);
      }
    } else {
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
