const express = require('express');
const path = require('path')
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))

const signUpRoute = require('./routes/signUpRoute')
const loginRoute = require('./routes/loginRoute')
const homePageRoute = require('./routes/homePageRoute');

app.use('/' , signUpRoute);
app.use('/', loginRoute);
app.use('/', homePageRoute)

mongoose.connect(
    process.env.MONGODB
)
.then(res => {
    console.log('MongoDB connected')
    app.listen(1010)
})
.catch(err => {
    console.log(err)
})


