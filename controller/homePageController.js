const path = require('path');
const Configuration = require('openai');
const OpenAIApi = require('openai')
require('dotenv').config();
const Chat = require('../models/chats')

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(config);


exports.showHomePage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'homepage', 'homepage.html'))
}

exports.userMessage = async (req, res) => {
    try {
        const userQuery = req.body.message;

        const history = await Chat.find()
        const convoHistory = history.flatMap(chat => chat.conversation);
        convoHistory.push({role: 'user', content: userQuery})
        const messagesForAi = convoHistory.map(message => {
            return {role: message.role, content: message.content}
        })
        const AIResponse = await openai.chat.completions.create({
            messages: messagesForAi,
            model: "gpt-3.5-turbo",
        })
        // console.log(AIResponse.choices[0].message.content)
        const aiResponse = AIResponse.choices[0].message.content
        console.log(aiResponse)

          const newChat = new Chat({
                userId: req.user,
             conversation: [
         {role: 'user', content: userQuery},
         {role: 'assistant', content: aiResponse}
          ]
            })
            newChat.save()

        res.status(200).json({
            content: aiResponse
        })
    } catch (err) {
        console.log(err)
    }
}