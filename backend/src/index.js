const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const { connectDb } = require('./helpers/db');
const { port, host, db, authApiUrl } = require('./configuration');
const app = express();

const postSchema = new mongoose.Schema({
    name: String,
})

const Post = mongoose.model('Post', postSchema);

const startServer = () => {
    app.listen(port, () => {
        console.log('Started api server on port', port);
        console.log('Started api server on host', host);
        console.log('Started authApiUrl server on host', authApiUrl);
        console.log('mongoo', db);
    })

    const silence = new Post({
        name: 'silence'
    })
    silence.save((err, saved) => {
        if (err) return console.error(err);
        console.log('saved', saved);
    })
    console.log('silence', silence)
}

app.get('/test', (req, res) => {
    res.send('Our API server is working correctly');
})

app.get('/api/testapidata', (req, res) => {
    res.json({
        testwithapi: true,
    })
})

app.get('/testwithcurrentuser', (req, res) => {
    console.log('wertey')
    axios.get(authApiUrl + '/currentUser').then((response) => {
        console.log('authApiUrl', authApiUrl);
        res.json({
            testwithcurrentUser: true,
            currentUserFromAuth: response.data,
        })
    })
})

connectDb()
    .on('error', console.log)
    .on('disconnect', connectDb)
    .once('open', startServer);