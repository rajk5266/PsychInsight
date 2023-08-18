const express = require('express')

const router = express.Router()
const controller = require('../controller/loginController')

router.get('/', controller.loginpage)

router.post('/login', controller.userLogin)

module.exports = router