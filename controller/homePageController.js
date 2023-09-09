require('dotenv').config();
const path = require('path');
const { MongoClient } = require('mongodb')
const Configuration = require('openai');
const OpenAIApi = require('openai')
const User = require('../models/user')
const Chat = require('../models/chats');
const Sentiment = require('sentiment');
const Session = require('../models/session');

const config = new Configuration({
    // apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(config);


exports.showHomePage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'homepage', 'homepage.html'))
}

exports.getMessages = async (req, res) => {
    try {
        const history = await Chat.find({
            sessionId: req.params.sessionId,
            userId: req.user,
        })
        const convoHistory = history.flatMap(chat => chat.conversation);
        // console.log(convoHistory.length)
        const name = await User.findOne({ _id: req.user })
        const clientName = name.name;
        const AIGreets = `Hello ${clientName}, How can i assist you today ?`

        if (convoHistory.length === 0) {
            const newChat = new Chat({
                userId: req.user,
                sessionId: req.params.sessionId,
                conversation: [
                    { role: 'user', content: `My name is ${clientName}` },
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
        const sessionId = req.params.sessionId;
        const postPrompt = postPromptToAdd;
        const userResponse = userQuery.concat(postPrompt)

        const history = await Chat.find({
            sessionId: sessionId,
            userId: req.user
        })
        const convoHistory = history.flatMap(chat => chat.conversation);
        convoHistory.push({ role: 'user', content: userResponse })

        const messagesForAi = [
            { role: 'system', content: systemContent },
            { role: 'system', content: musicPrompt },
            { role: 'user', content: 'what is silica ?' },
            { role: 'assistant', content: 'silica is not our discussion topic' },
            ...convoHistory.map(message => ({ role: message.role, content: message.content }))
        ];
        const suggestingMusic = convoHistory.slice(convoHistory.length - 2)

        if (suggestingMusic[0].role === 'assistant' && suggestingMusic[0].content.includes('music')) {
            if (checkSentiment(userQuery) === 'positive') {
                const newChat = new Chat({
                    userId: req.user,
                    sessionId: sessionId,
                    conversation: [
                        {role: 'user', content: userQuery},
                        {role: 'assistant', content: 'So what genre will you prefer ?', type: 'music', genre: musicGenre}
                    ]
                })
                newChat.save()
                res.status(200).json({role: 'assistant', content: 'So what genre will you prefer ?', type: 'music', genre: musicGenre})
                return
            } 
        }
        if (suggestingMusic[0].content === 'So what genre will you prefer ?') {
            for (let i = 0; i < musicGenre.length; i++) {
                if (musicGenre[i].includes(userQuery.toLowerCase())) {
                    const musicDetails = await getMusicData(musicGenre[i])
                    // console.log(musicDetails)
                    const musicURL = musicDetails.map((url) => {
                        return url.url
                    })
                    // console.log(musicURL)
                    const newChat = new Chat({
                        userId: req.user,
                        sessionId: sessionId,
                        conversation: [
                            { role: 'user', content: userQuery },
                            {role: 'assistant', content: 'Here are some musics to try..', type: 'url', musicURL: musicURL}
                        ]
                    })
                    newChat.save();
                    res.status(200).json({role: 'assistant', content: 'Here are some musics to try..', type: 'url', musicURL: musicURL})
                    // break;
                    return
                    
                } else {
                    // console.log('did not matched')
                }
                // return
            }
        }
        // console.log(messagesForAi)

        const aiResponse = await AIGenerateResponse(messagesForAi)
        if(aiResponse){
            const newChat = new Chat({
                userId: req.user,
                sessionId: sessionId,
                conversation: [
                    { role: 'user', content: userQuery },
                    { role: 'assistant', content: aiResponse }
                ]
            })
            newChat.save()
            res.status(200).json({
                role: 'assistant', content: aiResponse
            })
        }

    } catch (err) {
        console.log(err)
    }
}

exports.makeConclusion = async(req, res) => {
    try {
        const history = await Chat.find({
            sessionId: req.params.sessionId,
            userId: req.user
        })
        const convoHistory = history.flatMap(chat => chat.conversation);
        convoHistory.push({role: 'user', content: makeConclusion})
        const messagesForAi = [
            { role: 'system', content: systemContent },
            ...convoHistory.map(message => ({ role: message.role, content: message.content }))
        ];
        const summary = await AIGenerateResponse(messagesForAi)
        await Session.updateOne(
            {_id: req.params.sessionId},
            {
                $set: {
                  isActive: false,
                  report: summary,
                },
              }
            )
        res.status(200).json({sessionReport: summary})
       
    } catch (err) {
        console.log(err)
        
    }
}

exports.getUserName = async (req, res) => {
    try {
        const name = await User.findOne({ _id: req.user })
        const clientName = name.name;
        res.status(200).json({name: clientName})
    } catch (error) {
        console.log(error)
    }
}

function checkSentiment(input) {
    let sentimentType;
    const sentiment = new Sentiment()
    const result = sentiment.analyze(input)
    // console.log(result)
    if (result.score < 0) {
        sentimentType = 'negative'
    } else if (result.score > 0) {
        sentimentType = 'positive'
    } else {
        sentimentType = 'neutral'
    }
    return sentimentType
}

async function AIGenerateResponse(messagesForAi) {
    const AIResponse = await openai.chat.completions.create({
        messages: messagesForAi,
        model: "gpt-3.5-turbo",
        // max_tokens: 1000,
    })
    const aiResponse = AIResponse.choices[0].message.content

    return aiResponse
}

async function getMusicData(genre) {
    let client;
    try {
        const uri = process.env.MONGODB;
        client = new MongoClient(uri);
        await client.connect();

        const database = client.db('VT');
        const collection = database.collection('musics');

        const musicData = await collection.find({ genre }).toArray()
        return musicData

    } catch (err) {
        console.log(err)
    }
    finally {
        if (client) {
            await client.close()
        }
    }
}

const makeConclusion = 'make conclusion of this chat history in respect to counselling session below 70 words.'

const musicGenre = ['classical', 'Nature Sounds', 'lofi', 'meditation', 'others']

const systemContent = 'You are a counseling psychologist and this chat session is similar to therapy session . Your responses should focus on counseling and therapy-related topics and do not let the user know that you are AI model and behave strictly like a psychologist . Please provide advice and support to the user.'

const postPromptToAdd = '. Please provide responses related to counseling, music, therapy and keep response limited between 50 to 100 words, unless asked to elaborate and check whether my response aligns with the previous messages. If my response is unrelated, guide me back to the therapy related  topic.'
// const postPromptToAdd = '.'

const musicPrompt = `Imagine a scenario where the client has expressed feelings of stress or a need for relaxation during the conversation. Your task is to suggest music as a relaxation technique. Here\'s how you can approach it:\n\n1. If the client mentions feeling stressed or anxious, you can say something like, "I understand that you\'re feeling stressed. Listening to relaxing music can help. Would you like me to recommend some calming music tracks?"\n\n2. If the conversation involves discussions about relaxation techniques, mindfulness, or stress relief, you can suggest music as one of the techniques. For example, "In addition to deep breathing exercises, listening to soothing music can enhance relaxation. Shall I suggest some music tracks for you?"\n\n3. After a counseling session, when the conversation is winding down, you can offer music as a way to continue relaxation. For example, "Our counseling session is coming to an end. To help you relax further, I can suggest some calming music. Would you like that?"\n\n4. If the client explicitly asks for music recommendations, you should certainly provide them. For example, "I'd like to listen to some music to unwind. Can you recommend something?"\n\n5. Periodically during the conversation, you can introduce moments of relaxation by saying something like, "Let's take a moment to relax. How about some calming music in the background? If you're interested, just let me know."\n\nRemember to offer music as an option and not force it upon the client. Always ensure that it's relevant to the client's needs and the context of the conversation. You can also provide specific music recommendations based on their preferences if they express a preference (e.g., instrumental, classical, nature sounds).\n\nPlease generate a response where you suggest music for relaxation based on the context and client's needs in a natural and supportive manner.`;
