const { DataTypes, QueryTypes } = require('sequelize')
const db = require('../db/db')
const validator = require('validator')

const CreditClass = db.define(
  'creditClass',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    tableName: 'credit-class',
    timestamps: false,
  }
)

CreditClass.prototype.toJSON = function () {
  return { ...this.get() }
}
CreditClass.getAllCreditClass = async () => {
  listCreditClass = await db.query(
    'SELECT cc.id, TeacherUserId, SubjectId, ClassId, subjectName, className, numOfCredit from `credit-class` as cc  join  `teachers` on TeacherUserId = userId join `classes` on ClassId= classes.id join `subjects` on subjects.id = SubjectId order by cc.id',
    { type: QueryTypes.SELECT }
  )
  return listCreditClass
}

module.exports = CreditClass
