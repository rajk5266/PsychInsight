const express = require('express')
const router = express.Router()

const auth = require('../authentication/auth')
const controller = require('../controller/musicPlayerController')

router.get('/musicPlayer', controller.showMusicPlayer)

router.get('/musicList', auth.auth, controller.getMusicList)

module.exports = router