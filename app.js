const express = require('express');
const path = require('path')
const cors = require('cors');
const bodyParser = require('body-parser');
const Configuration= require('openai');
const OpenAIApi = require('openai');
const sequelize = require('./util/databse')
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname , 'public')))

const signUpRoute = require('./routes/signUpRoute')
const loginRoute = require('./routes/loginRoute')
// const Users

app.use('/' , signUpRoute);
app.use('/', loginRoute)

// const config = new Configuration({
//     apiKey :process.env.OPENAI_API_KEY
// });
// const openai = new OpenAIApi(config);

// app.get('/', (req, res) => {
//     res.send('welcome to world of virtual therapy')
// })

// app.post('/message', async (req, res) => {
//     try {
//         const aiResponse = await openai.createChatCompletion({
//             model: "text-davinci-003",
//             messages: [{
//                 role :"user",
//                 content: "what is your name ?"
//             }]
//         })
//         res.json({
//             ai_response: aiResponse.data.choices[0]
//         })
//     } catch (error) {
//         console.log(error)
//     }
// })

sequelize
.sync()
.then(result => {
    console.log('database connected');
    app.listen(1010)
})
.catch(err => console.log(err))