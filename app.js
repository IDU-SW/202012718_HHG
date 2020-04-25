const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false }));

const gameRouter = require('./Router/GameRouter');
app.use(gameRouter);

module.exports = app;