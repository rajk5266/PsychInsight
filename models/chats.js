const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    
    conversation: {
        type: Array,
        required: true,
    },
    userId: {
        type: String,
        required: true
    },
    // chatLength: {
    //     type: Number,
    // }
    sessionId: {
        type: String,
        required: true
    }
})

const Chats = mongoose.model('Chats', chatSchema)
module.exports = Chats