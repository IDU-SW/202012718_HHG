const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false }));
const gameRouter = require('./Router/GameRouter');
app.use(gameRouter);
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/gameList.html');
});
app.get('/gameAdd.html', (req, res) => {
    res.sendFile(__dirname + '/views/gameAdd.html');
});
app.get('/gameInfo.html', (req, res) => {
    res.sendFile(__dirname + '/views/gameInfo.html');
});
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
module.exports = app;