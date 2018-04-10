const express = require('express');
const mongoose = require('mongoose');
const algoliasearch = require('algoliasearch');
const bodyParser = require('body-parser');

const client = algoliasearch('8HYBSNX4Q5', '5d225d11ef765b21fb13bc97688801ef');

// mongoose.connect('mongodb://mongo:27017').then((res) => {
//     console.log(res);
// }).catch((err) => {
//     console.log(err.message);
// });

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

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
    
    console.log('profile:');
    //console.log(profile);
    console.log(req.body);
    const profile = req.body.profile;
    client.initIndex('profiles').partialUpdateObject(profile);
    res.ok();
})

app.get('/ping', (req, res) => {
    res.send('Search service is healthy');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);