const express = require('express')

const router = express.Router()
const controller = require('../controller/homePageController')
const auth  = require('../authentication/auth')

router.get('/homepage', controller.showHomePage)

router.post('/sendMessage/:sessionId', auth.auth,controller.userMessage)

router.get('/getMessages/:sessionId', auth.auth, controller.getMessages)

router.get('/getName/', auth.auth, controller.getUserName)


module.exports = router;