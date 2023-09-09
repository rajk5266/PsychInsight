const Session = require('../models/session');
const mongodb = require('mongodb');

exports.newSession = async (req, res) => {
try {
    // console.log(req.user)
    const newSession = new Session({
        userId: req.user,
        isActive: true,
        date: new Date()
    })
    newSession.save();
    console.log("new session",newSession)
    const sessionId = newSession._id.toString()

    res.status(200).json({sessionId: sessionId, isActive: true, })
    
} catch (error) {
    console.log(error)
}
}

exports.currentSession = async (req, res) => {
    try {
        const session = await Session.find({isActive: true, userId: req.user})
        // console.log(session)
        res.status(200).json({session: session})
    } catch (error) {
        console.log(error)
    }
}

exports.getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find({
            userId: req.user,
            isActive: false
        })
        // console.log(sessions)
        res.status(200).json({sessions: sessions})
    } catch (error) {
        console.log(error)
    }
}
