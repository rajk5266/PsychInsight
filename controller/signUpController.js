const path = require('path')
const Users = require('../models/user')
const bcrypt = require('bcrypt')

exports.signUpPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'signup', 'signUp.html'))
}

exports.registerUser = async (req, res) =>{
    try{
        console.log(req.body)
        const {name, email, password} = req.body;
        const saltrounds  = 10;
const userExist = await Users.findOne({
    where: {email}
})
console.log("userExist", userExist)

if(userExist){
    return res.json({message: "user already exist"})
}
        bcrypt.hash(password, saltrounds, async(err, hash) =>{
            console.log('cjeck')
            await Users.create({
                name: name,
                email: email,
                password: hash
            })
            res.status(200).json({message: "user added succesfully"})
        })
    }catch(err){
        console.log('error', err)
            res.status(500).json({ message: 'something went wrong'})
    }
}