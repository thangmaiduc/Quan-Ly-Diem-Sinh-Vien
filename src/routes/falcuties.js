var express = require("express");
var router = express.Router();
const falcutyModel = require("../model/falcuties");
const classModel = require("../model/classes");
// const db = require('../db/db')

/* GET users listing. */
//liet ke toan bo khoa trong truong
router.get("/", async (req, res, next) => {
  try {
    let falcuties = await falcutyModel.findAll();

    if (!falcuties) {
      return res
        .status(404)
        .json({ error: { massage: "Chua co khoa nao, hay toa them khoa" } });
    } else {
      return res.status(200).json(falcuties);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});
//tim kiem khoa bang ten
router.get("/search=:search", async (req, res, next) => {
  const search = req.params.search;
  try {
    let falcuties = await falcutyModel.findAll({
      where: {
        falcutyName: {
          $like: "%" + search + "%",
        },
      },
    });

    if (falcuties.length===0) {
      return res
        .status(404)
        .json({ error: { massage: "Khong co khoa nao ten: "+search } });
    } else {
      return res.status(200).json(falcuties);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});
// liet ke danh sach lop thuoc khoa
router.get("/list-class.:falcutyId", async (req, res, next) => {
  const falcutyId = req.params.falcutyId;
  try {
    let listClass = await classModel.findAll({ where: { falcutyId } });

    if (!listClass) {
      return res
        .status(404)
        .json({ error: { massage: "Chua co khoa nao, hay toa them khoa" } });
    } else {
      return res.status(200).json(listClass);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});
// them khoa
router.post("/add-falcuty", async (req, res, next) => {
  const falcutyName = req.body.falcutyName;

  try {
    let falcuty = await falcutyModel.findOne({ where: { falcutyName } });

    if (!falcuty) {
      falcuty = await falcutyModel.create(req.body);
      return res.status(200).json(falcuty);
    } else {
      return res
        .status(400)
        .json({ error: { massage: "falcuty has already exist " } });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
