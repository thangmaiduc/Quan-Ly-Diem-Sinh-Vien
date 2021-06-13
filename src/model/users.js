const { Sequelize, DataTypes, QueryTypes } = require('sequelize')
const db = require('../db/db')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const Student = require('./students')

const User = db.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        len: {
          args: [3, 20],
          msg: 'Length of last name is from 3 to 20',
        },
      },
    },
    lastName: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        len: {
          args: [3, 20],
          msg: 'Length of first name is from 3 to 20',
        },
      },
    },
    sex: {
      type: DataTypes.STRING(15),
      defaultValue: 'undefined',
      validate: {
        isIn: [['male', 'female', 'undefined']],
      },
    },
    role: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        isIn: [['admin', 'student', 'teacher']],
      },
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Invalid Email.Example: exam132@exam.com. Please input again ',
        },
      },
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
      // set(value){
      //     this.setDataValue('password', bcrypt.hashSync(value, 8));
      // },
      validate: {
        len: {
          args: [8, 64],
          msg: 'Invalid Password.  Length of password is from 8 and up to',
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`
      },
      set(value) {
        throw new Error('Do not try to set the `fullName` value!')
      },
    },
  },
  {
    tableName: 'users',
    // freezeTableName: true
    timestamps: true,
  }
)

User.prototype.toJSON = function () {
  return {
    ...this.get(),
    password: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    firstName: undefined,
    lastName: undefined,
  }
}
User.beforeCreate(async (user, option) => {
  const hashPassword = await bcrypt.hash(user.password, 8)
  user.password = hashPassword
})

User.findByCredentials = async (email, password) => {
  user = await User.findOne({ where: { email } })
  if (!user) {
    return null
  }
  const isMatch = bcrypt.compare(password, user.password)
  if (!isMatch) {
    return null
  }
  return user
}

// create = build+save
// update = jane.name changed + save
// try {
//     const jane = await User.create({ firstName: "JaneD" , lastName: "Macobus" , password: "12345678", email: 'thang1@gmail.com', sex: 'male'});
// console.log(jane.toJSON());
// //await jane.update({firstName: "Naka" , lastName: "Macobus II"})
// console.log(JSON.stringify(jane));
// } catch (error) {
//     console.log(error);
// }

//tim kiem +dk+  show ra cac thuoc tinh can thiet
// const users = await User.findAll({
// where: {     //dk la first name like 'sad%'
//     firstName:{
//         $like : 'sad%'
//     }
// },

// attributes: [    //show ra tap thuoc tinh nhu select fname, lname, count(fname) as n_fname
//     'firstName', 'lastName',
//      [db.fn('COUNT', db.col('firstName')), 'n_fName']
//     ],

// attributes: {exclude: ['id', 'createdAt', 'updatedAt']}

// attributes: {
//     include: [
//         [db.fn('COUNT', db.col('firstName')), 'n_fName']
//     ]
// }

//     order: [['firstName', 'DESC']], // sap xep
//     group: 'firstName',     // nhom group by
//     offset: 5, // skip r show
//     limit: 5  // gioi han chi 5

// });
// console.log(JSON.stringify(users, null, 2));

// dem bao nhieu phan tu thoa man dk, tuong tu cho max, min, sum
// const amount =await User.count({
//     where: {
//         firstName:{
//             $notlike: 'sad'
//         }

//     }
// });
// console.log(amount);

// const result=await db.query("select * from users", {type: QueryTypes.SELECT});
// console.log(result);

//
module.exports = User
