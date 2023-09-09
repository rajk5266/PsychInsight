const {MongoClient} = require('mongodb')
require('dotenv').config()
// const mongoose = require('mongoose')
const path = require('path')

exports.showMusicPlayer = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'musicPlayer', 'musicPlayer.html'))
}

exports.getMusicList = async(req, res) => {
    let client;
    try {
        const uri = process.env.MONGODB;
        client = new MongoClient(uri);
        await client.connect();

        const database = client.db('VT');
        const collection = database.collection('musics');

        const musicData = await collection.find().toArray()
        res.status(200).json(musicData)

    } catch (err) {
        console.log(err)
    }
    finally {
        if (client) {
            await client.close()
        }
    }
}
