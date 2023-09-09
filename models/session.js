const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    isActive: {
        type:Boolean,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    report: String
})

const Session = mongoose.model('session', sessionSchema)

module.exports = Session