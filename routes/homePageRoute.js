const express = require('express')

const router = express.Router()
const controller = require('../controller/homePageController')
const auth  = require('../authentication/auth')

router.get('/homepage', controller.showHomePage)

router.post('/sendMessage', auth.auth,controller.userMessage)

router.get('/getMessages', auth.auth, controller.getMessages)



module.exports = router;