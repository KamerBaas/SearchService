const express = require('express');
const mongoose = require('mongoose');
const algoliasearch = require('algoliasearch');

const client = algoliasearch('8HYBSNX4Q5', '5d225d11ef765b21fb13bc97688801ef');

mongoose.connect('mongodb://mongo:27017').then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err.message);
});

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/search', (req, res) => {
    if(!req.query.term){
        return res.status(400).send('Please provide req.query.term as a String');
    }
    client.initIndex('profiles').search({query: req.query.term}).then((results) => {
        res.send(results);
    }).catch((err) => {
        res.status(500).send(err.message);
    })
});

app.post('/profile', (req, res) => {
    if(!req.body.profile || !req.body.profile.objectID){
        res.status(400).send('Please provide req.body.profile with property objectID');
    }
    const profile = req.body.profile;
    client.initIndex('profiles').partialUpdateObject();
})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);