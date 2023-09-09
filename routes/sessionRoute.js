const express = require('express');
const router = express.Router()
const auth = require('../authentication/auth')
const controller = require('../controller/sessionController');
const homepageController = require('../controller/homePageController')

router.get('/newSession', auth.auth, controller.newSession)

router.get('/currentSession', auth.auth, controller.currentSession )

router.get('/endSession/:sessionId' , auth.auth, homepageController.makeConclusion)

router.get('/allSessions', auth.auth, controller.getAllSessions)
module.exports = router