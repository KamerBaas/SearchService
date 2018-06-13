const express = require('express');
const mongoose = require('mongoose');
const algoliasearch = require('algoliasearch');
const bodyParser = require('body-parser');
var crypto = require('crypto'),
    key = 'Waar komt het vandaan? In tegenstelling tot wat algemeen aangenomen ';

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

app.get('/stress', (req, res) => {
    var text = "Waar komt het vandaan? In tegenstelling tot wat algemeen aangenomen wordt is Lorem Ipsum niet zomaar willekeurige tekst. het heeft zijn wortels in een stuk klassieke latijnse literatuur uit 45 v.Chr. en is dus meer dan 2000 jaar oud. Richard McClintock, een professor latijn aan de Hampden-Sydney College in Virginia, heeft één van de meer obscure latijnse woorden, consectetur, uit een Lorem Ipsum passage opgezocht, en heeft tijdens het zoeken naar het woord in de klassieke literatuu de onverdachte bron ontdekt. Lorem Ipsum komt uit de secties 1.10.32 en 1.10.33 van (De uitersten van goed en kwaad) door Cicero, geschreven in 45 v.Chr. Dit boek is een verhandeling over de theorie der ethiek, erg populair tijdens de renaissance. De eerste regel van Lorem Ipsum, Lorem ipsum dolor sit amet.. , komt uit een zin in sectie 1.10.32.";
    var i = 0;

    var response = "";
    while(i < 400){
        // create hahs
        var hash = crypto.createHmac('sha512', key)
        hash.update(text)
        var value = hash.digest('hex')

        i++;
        // print result
        response += value;
    }
    res.send(response);
})

app.post('/profile', (req, res) => {
    if(!req.body.profile || !req.body.profile.objectID){
        res.status(400).send('Please provide req.body.profile with property objectID');
    }
    
    console.log('profile:');
    //console.log(profile);
    console.log(req.body);
    const profile = req.body.profile;
    client.initIndex('profiles').partialUpdateObject(profile);
    res.sendStatus(200);
})

app.get('/ping', (req, res) => {
    res.send('Search service is healthy');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);