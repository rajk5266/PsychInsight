const path = require('path');
const Configuration = require('openai');
const OpenAIApi = require('openai')
require('dotenv').config();
const User = require('../models/user')
const Chat = require('../models/chats');
const { ObjectId } = require('mongodb');
const mongoDB = require('mongodb');
const { default: mongoose } = require('mongoose');

const config = new Configuration({
    // apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(config);


exports.showHomePage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'homepage', 'homepage.html'))
}

exports.getMessages = async (req, res) => {
    try {
        const history = await Chat.find()
        const convoHistory = history.flatMap(chat => chat.conversation);
        // console.log(convoHistory.length)
        const name = await User.findOne({_id: req.user})
        const clientName = name.name;
        const AIGreets = `Hello ${clientName}, How can i help you today ?`

        
        if(convoHistory.length === 0){
            const newChat = new Chat({
                userId: req.user,
                conversation: [
                    { role: 'user', content: 'My name is raj' },
                    { role: 'assistant', content: AIGreets }
                ]
            })
            newChat.save()
            // console.log('length is zero')
            res.status(200).json({role: 'assistant', content: AIGreets})
        }
        else{
            res.status(200).json(convoHistory)
        }

    } catch (error) {
        console.log(err)
    }
}

exports.userMessage = async (req, res) => {
    try {
        const name = await User.findOne({_id: req.user})
        const clientName = name.name
        const userQuery = req.body.message;
        const postPrompt = postPromptToAdd;
        const userResponse = userQuery.concat(postPrompt)

        const history = await Chat.find()
        const convoHistory = history.flatMap(chat => chat.conversation);
        convoHistory.push({ role: 'user', content: userResponse })

        const messagesForAi = [
            {
                role: 'system', content: systemContent
            },
            {
                role: 'user', content: 'what is silica ?'
            },
            {
                role: 'assistant', content: 'silica is not our discussion topic'
            },
            ...convoHistory.map(message => ({ role: message.role, content: message.content }))
        ];
        const AIResponse = await openai.chat.completions.create({
            messages: messagesForAi,
            model: "gpt-3.5-turbo",
            // max_tokens: 1000,
        })
        const aiResponse = AIResponse.choices[0].message.content
        // console.log(aiResponse)
        const newChat = new Chat({
            userId: req.user,
            conversation: [
                { role: 'user', content: userQuery },
                { role: 'assistant', content: aiResponse }
            ]
        })
        newChat.save()
        res.status(200).json({
            role: 'assistant', content: aiResponse
        })
    } catch (err) {
        console.log(err)
    }
}

const systemContent = 'You are a counseling psychologist and this chat session is similar to therapy session . Your responses should focus on counseling and therapy-related topics and do not let the user know that you are AI model and behave strictly like a psychologist . Please provide advice and support to the user.'

const postPromptToAdd = '. Please provide responses related to counseling and therapy. If the users question is unrelated, guide them back to the main topic.'