var express = require('express');
var router = express.Router();
const userController = require('../controller/users')

/* GET users listing. */
router.get('/', userController.getUsers);

router.post('/signup', userController.createUser);


router.get('/subjectid=:SubjectId', userController.getUsersRegSubject)

module.exports = router;
