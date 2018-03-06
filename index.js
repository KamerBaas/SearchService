const express = require('express');
const mongoose = require('mongoose');

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
app.get('/', (req, res) => {
  res.send('Hello world\n');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);