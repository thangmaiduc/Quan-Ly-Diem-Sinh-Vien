var express = require('express')
var router = new express.Router()
const Subject = require('../model/subjects')

const { authUser, authRole } = require('../middlewave/auth')

/* GET users listing. */

// them mon hoc
router.post(
  '/add-subject',
  authUser,
  authRole('admin'),
  async (req, res, next) => {
    const subjectName = req.body.subjectName

    try {
      let subject = await Subject.findOne({ where: { subjectName } })
      if (!subject) {
        subject = await Subject.create(req.body)
        return res.status(200).json(subject)
      } else {
        return res
          .status(400)
          .json({ error: { message: 'Môn học đã tồn tại ' } })
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json(error)
    }
  }
)

//liet ke tat ca mon hoc
router.get('/', authUser, authRole('admin'), async (req, res, next) => {
  try {
    let subjects = await Subject.findAll()

    if (!subjects) {
      return res
        .status(404)
        .json({ error: { message: 'Không có bất cứ khoa nào' } })
    } else {
      return res.status(200).json(subjects)
    }
  } catch (error) {
    return res.status(500).json(error)
  }
})

//xoa lop hoc bang id
router.delete(
  '/delete/:id',
  authUser,
  authRole('admin'),
  async (req, res, next) => {
    id = req.params.id
    try {
      const subject = await Subject.findByPk(id)
      if (!subject)
        return res
          .status(404)
          .send({ error: { message: 'Không tìm thấy môn học cần xóa' } })
      await Subject.destroy({ where: { id } })
      return res.status(200).send('Xóa môn học thành công')
    } catch (error) {
      console.log(error)
      return res.status(500).json(error)
    }
  }
)
// tim kiem bang ten
router.get('/search=:search', authUser, async (req, res, next) => {
  const search = req.params.search
  try {
    let subjects = await Subject.findAll({
      where: {
        subjectName: {
          $like: '%' + search + '%',
        },
      },
    })
    console.log(subjects)
    if (subjects.length === 0) {
      return res
        .status(404)
        .json({
          error: { message: 'Khong tim thay mon hoc nao co ten: ' + search },
        })
    } else {
      return res.status(200).json(subjects)
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
})

module.exports = router
