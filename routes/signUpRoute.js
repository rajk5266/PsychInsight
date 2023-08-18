const express = require('express')

const router = express.Router()
const controller = require('../controller/signUpController')

router.get('/signup', controller.signUpPage)

router.post('/signup', controller.registerUser)

module.exports = router