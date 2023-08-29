require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const auth = (req, res, next) => {
    try{ 
        const token = req.header('Authorization');
        // console.log(token)
        const {userId} = jwt.verify(token, process.env.TOKEN);
        User.findById(userId)
        .then(user => {
            req.user = userId;
            next();
        })
        .catch(err => console.log(err))

    }catch(err){
        console.log(err)
        return res.status(401).json({success: false})
    }
}

module.exports = {auth}