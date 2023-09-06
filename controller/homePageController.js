const path = require('path');
const Configuration = require('openai');
const OpenAIApi = require('openai')
require('dotenv').config();
const User = require('../models/user')
const Chat = require('../models/chats');
const Sentiment = require('sentiment');
const natural = require('natural')

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
        const name = await User.findOne({ _id: req.user })
        const clientName = name.name;
        const AIGreets = `Hello ${clientName}, How can i help you today ?`


        if (convoHistory.length === 0) {
            const newChat = new Chat({
                userId: req.user,
                conversation: [
                    { role: 'user', content: 'My name is raj' },
                    { role: 'assistant', content: AIGreets }
                ]
            })
            newChat.save()
            // console.log('length is zero')
            res.status(200).json({ role: 'assistant', content: AIGreets })
        }
        else {
            res.status(200).json(convoHistory)
        }

    } catch (error) {
        console.log(err)
    }
}

exports.userMessage = async (req, res) => {
    try {
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
        // const suggestingMusic = convoHistory.slice(convoHistory.length-2)
        // if(suggestingMusic[0].role === 'assistant' && suggestingMusic[0].content.includes('music')){
        //     paraMeaning(suggestingMusic[0].content)
        //     if(suggestingMusic[1].role === 'user'){
        //         // console.log(checkSentiment(userQuery))
        //     }
        // }
        //including musicprompt
        // messagesForAi.push({role: 'system', content: musicPrompt})
        
        const aiResponse = await AIGenerateResponse(messagesForAi)

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

function checkSentiment(input) {
    let sentimentType;
    const sentiment = new Sentiment()
    const result = sentiment.analyze(input)
    if(result.score <0 ){
        sentimentType = 'negative'
    }else{
        sentimentType = 'positive'
    }
    return sentimentType
}
async function AIGenerateResponse(messagesForAi){
    const AIResponse = await openai.chat.completions.create({
            messages: messagesForAi,
            model: "gpt-3.5-turbo",
            // max_tokens: 1000,
        })
        const aiResponse = AIResponse.choices[0].message.content
        
        return aiResponse
}
const systemContent = 'You are a counseling psychologist and this chat session is similar to therapy session . Your responses should focus on counseling and therapy-related topics and do not let the user know that you are AI model and behave strictly like a psychologist . Please provide advice and support to the user.'

const postPromptToAdd = '. Please provide responses related to counseling, music and therapy. If the users question is unrelated, guide them back to the main topic.'

const musicPrompt = `Imagine a scenario where the client has expressed feelings of stress or a need for relaxation during the conversation. Your task is to suggest music as a relaxation technique. Here\'s how you can approach it:\n\n1. If the client mentions feeling stressed or anxious, you can say something like, "I understand that you\'re feeling stressed. Listening to relaxing music can help. Would you like me to recommend some calming music tracks?"\n\n2. If the conversation involves discussions about relaxation techniques, mindfulness, or stress relief, you can suggest music as one of the techniques. For example, "In addition to deep breathing exercises, listening to soothing music can enhance relaxation. Shall I suggest some music tracks for you?"\n\n3. After a counseling session, when the conversation is winding down, you can offer music as a way to continue relaxation. For example, "Our counseling session is coming to an end. To help you relax further, I can suggest some calming music. Would you like that?"\n\n4. If the client explicitly asks for music recommendations, you should certainly provide them. For example, "I'd like to listen to some music to unwind. Can you recommend something?"\n\n5. Periodically during the conversation, you can introduce moments of relaxation by saying something like, "Let's take a moment to relax. How about some calming music in the background? If you're interested, just let me know."\n\nRemember to offer music as an option and not force it upon the client. Always ensure that it's relevant to the client's needs and the context of the conversation. You can also provide specific music recommendations based on their preferences if they express a preference (e.g., instrumental, classical, nature sounds).\n\nPlease generate a response where you suggest music for relaxation based on the context and client's needs in a natural and supportive manner.`;
