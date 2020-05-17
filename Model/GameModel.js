const fs = require('fs');
const pool = require('./dbConnection');
const {prepareTable} = require('./prepareTable');
const Sequelize = require('sequelize');
const dbConnectUri = 'mysql://dev:secret@127.0.0.1:3306/example';
const sequelize = new Sequelize(dbConnectUri); 

class Games extends Sequelize.Model { }
    Games.init({
        id: { 
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: Sequelize.STRING,
        publisher: Sequelize.STRING,
        year: Sequelize.INTEGER
    }, {tableName:'games', sequelize, timestamps: false});



class Game {
    constructor() {
        const data = fs.readFileSync('./model/data.json');
        this.games = JSON.parse(data)
    }

    async oneDataInsert(game) {
        try {
            let gameData = await Games.create({ 
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

    async allDataInsert() {
        const data = fs.readFileSync('./model/data.json');
        const games = JSON.parse(data);
        for (var game of games ) {
            await this.oneDataInsert(game);
        }
    }

    // Promise 예제
    getGameList = async() => {
        let returnValue;
        await Games.findAll({})
        .then( results => {
            returnValue = results;
        })
        .catch( error => {
            console.error('Error :', error);
        });
        return returnValue;
    }

    addGame = async(title, publisher, year) => {
        // let conn;
        // try {
        //     conn = await pool.getConnection();
            
        //     const sqlI = 'INSERT INTO games(title, publisher, year) values (?, ?, ?)';
        //     const data = [title, publisher, year];
        //     const resultI = await conn.query(sqlI, data);
            
        //     const sqlS = 'SELECT * FROM games WHERE id = ?;';
        //     const resultS = await conn.query(sqlS, resultI[0].insertId);
        //     return resultS[0];
        // } catch(error) {
        //     console.error(error);
        // } finally {
        //     if(conn) {
        //         conn.release();
        //     }
        // }
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
            const ret = await Games.findAll({
                where:{id:gameId}
            });

            if ( ret ) {
                return ret[0];
            }
            else {
                console.log('데이터 없음');
            }
        }
        catch (error) {
            console.log('Error :', error);
        }
    }

    deleteGame = async(gameId) => {
        // const sql = 'DELETE FROM games WHERE id = ?';
        // let conn;
        // try {
        //     conn = await pool.getConnection();
        //     const result = await conn.query(sql, [gameId]);
        //     return null;
        // } catch(error){
        //     console.error(error);
        // } finally {
        //     if (conn){
        //         conn.release();
        //     }
        // }
        try {
            let result = await Games.destroy({where: {id:gameId}});
        } catch (error) {
            console.error(error);  
        }
    }

    updateGame = async(gameId, title, publisher, year) => {
        // let conn;
        // try {
        //     conn = await pool.getConnection();
        //     const sql = 'UPDATE games SET title = ?, publisher = ?, year = ? WHERE id = ?';
        //     await conn.query(sql, [title, publisher, year, gameId]);
        //     return this.getGameDetail(gameId);
        // } catch (error){
        //     console.error(error);
        // } finally {
        //     if(conn){
        //         conn.release();
        //     }
        // }

        try {
            let game = await this.getGameDetail(gameId);
            game.dataValues.title = !title ? game.title : title;
            game.dataValues.publisher = !publisher ? game.publisher : publisher;
            game.dataValues.year = !year ? game.year : year;

            let ret = await game.save();
            return ret;
        } catch (error) {
            console.error(error);  
        }
    }
}

module.exports = new Game();