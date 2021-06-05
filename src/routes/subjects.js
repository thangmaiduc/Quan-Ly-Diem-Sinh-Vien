var express = require("express");
var router = express.Router();
const Subject = require("../model/subjects");
const StudentHasSubject = require("../model/student_has_subject");
const userModel = require("../model/users");
const studentModel = require("../model/students");
const Student = require("../model/students");

const { authUser } = require("../middlewave/auth");


/* GET users listing. */

// them mon hoc
router.post("/add-subject", async (req, res, next) => {
  const subjectName = req.body.subjectName;

  try {
    let subject = await Subject.findOne({ where: { subjectName } });
    if (!subject) {
      subject = await Subject.create(req.body);
      return res.status(200).json(subject);
    } else {
      return res
        .status(400)
        .json({ error: { massage: "Subject has already exist " } });
    }
  } catch (error) {
      console.log(error);
    return res.status(500).json(error);
  }
});

//liet ke tat ca mon hoc
router.get("/", async (req, res, next) => {
  try {
    let subjects = await Subject.findAll();

    if (!subjects) {
      return res
        .status(404)
        .json({ error: { massage: "Chua co khoa nao, hay toa them khoa" } });
    } else {
      return res.status(200).json(subjects);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

// chi tiet mon hoc -  liet ke tat ca sinh vien tham gia mon hoc co id
router.get("/subjectid=:SubjectId", authUser, async (req, res, next) => {
  SubjectId = req.params.SubjectId;
  try {
    let listStudentRegSubject = await userModel.findAll({
      include: {
        model: studentModel,
        required: true,
        include: {
          model: Subject,
          required: true,
          where: {
            id: SubjectId,
          },
        },
      },
    });
    if (listStudentRegSubject===[]) {
      return res
        .status(404)
        .json({ error: { massage: "Chua co khoa nao, hay toa them khoa" } });
    } else {
      return res.status(200).json(listStudentRegSubject);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});
//xoa lop hoc bang id
router.delete("/.:id", async (req, res, next) => {
  id = req.params.id;
  try {
        const subject = await Subject.findByPk(id);
        if(!subject) return res.status(404).send('Khong tim thay mon hoc can xoa');
        await Subject.destroy({where:{id}})
        return res.status(200).send('Xoa mon hoc thanh cong');
    
  } catch (error) {
      console.log(error);
    return res.status(500).json(error);
  }
});
// tim kiem bang ten
router.get("/search=:search", async (req, res, next) => {
    const search = req.params.search;
    try {
      let subjects = await Subject.findAll({
        where: {
          subjectName: {
            $like: "%" + search + "%",
          },
        },
      });
      console.log(subjects);
      if (subjects.length===0) {
        return res
          .status(404)
          .json({ error: { massage: "Khong tim thay mon hoc nao co ten: "+search } });
      } else {
        return res.status(200).json(subjects);
      }
    } catch (error) {
        console.log(error);
      return res.status(500).json(error);
    }
  });

module.exports = router;
