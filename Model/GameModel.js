const fs = require('fs');
const pool = require('./dbConnection');
const {prepareTable} = require('./prepareTable');
// const Sequelize = require('sequelize');
// const dbConnectUri = 'mysql://dev:secret@127.0.0.1:3306/example';
// const sequelize = new Sequelize(dbConnectUri); 
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017';
var ObjectID = require('mongodb').ObjectID;

var db;

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, database) {
    if (err) {
        console.error('MongoDB 연결 실패', err);
        return;
    }
    db = database.db('example');
});

class Game {
    constructor() {
        const data = fs.readFileSync('./model/data.json');
        this.games = JSON.parse(data)
    }

    async oneDataInsert(game) {
        try {
            let gameData = await db.collection('game').insertOne({ 
                            title : game.title, 
                            publisher : game.publisher, 
                            year : game.year
                        }, {logging:false});
            const newData = gameData.dataValues;

            return newData;
        } catch (error) {
            console.error(error);
        }
    }

    // Promise 예제
    getGameList = async() => {
        return await db.collection('game').find({}).toArray();
    }

    addGame = async(title, publisher, year) => {
        const games = {title, publisher, year};
        try {
            const returnValue = await this.oneDataInsert(games);
            console.log(returnValue);
            return returnValue;
        } catch (error) {
            console.error(error);
        }
    }

    // Promise - Reject
    getGameDetail = async(gameId) => {
        try {
            return await db.collection('game').findOne({ _id: new ObjectID(gameId) });
        }
        catch (error) {
            console.log('Error :', error);
        }
    }

    deleteGame = async(gameId) => {
        try {
            let result = await db.collection('game').deleteOne({ _id: new ObjectID(gameId) });
        } catch (error) {
            console.error(error);  
        }
    }

    updateGame = async(gameId, title, publisher, year) => {
        try {
            let game = await this.getGameDetail(gameId);
            game.dataValues.title = !title ? game.title : title;
            game.dataValues.publisher = !publisher ? game.publisher : publisher;
            game.dataValues.year = !year ? game.year : year;

            let ret = await db.collection('game').updateOne({_id: new ObjectID(gameId)}, {$set : {title: title, publisher: publisher, year: year}});

            return ret;
        } catch (error) {
            console.error(error);  
        }
    }
}

module.exports = new Game();