const fs = require('fs');
const pool = require('./dbConnection');
const {prepareTable} = require('./prepareTable');

class Game {
    constructor() {
        const data = fs.readFileSync('./model/data.json');
        this.games = JSON.parse(data)
    }

    // Promise 예제
    getGameList = async() => {
        // if (this.games) {
        //     return this.games;
        // }
        // else {
        //     return [];
        // }

        const sql = 'SELECT * FROM games';
        let conn;
        try {
            var returnList = new Array();
            conn = await pool.getConnection();
            const [games, metadata] = await conn.query(sql);
            console.log("games", games);
            // for(let game of games) {
            //     returnList.push(game);
            // }
            // console.log("returnList:",returnList);
            return games;
        } catch(error){
            console.error(error);
        } finally {
            if(conn) {
                conn.release();
            }
        }
    }

    addGame = async(title, publisher, year) => {
        let conn;
        try {
            conn = await pool.getConnection();
            
            const sqlI = 'INSERT INTO games(title, publisher, year) values (?, ?, ?)';
            const data = [title, publisher, year];
            const resultI = await conn.query(sqlI, data);
            
            const sqlS = 'SELECT * FROM games WHERE id = ?;';
            const resultS = await conn.query(sqlS, resultI[0].insertId);
            return resultS[0];
        } catch(error) {
            console.error(error);
        } finally {
            if(conn) {
                conn.release();
            }
        }
    }

    // Promise - Reject
    getGameDetail = async(gameId) => {
        let conn;
        try {
            conn = await pool.getConnection();
            const sql = 'SELECT * FROM games WHERE id = ?;';
            const [detail, metadata] = await conn.query(sql, gameId);
            return detail[0];
        } catch(error) {
            console.error(error);
        } finally {
            if(conn){
                conn.release();
            }
        }
    }

    deleteGame = async(gameId) => {
        const sql = 'DELETE FROM games WHERE id = ?';
        let conn;
        try {
            conn = await pool.getConnection();
            const result = await conn.query(sql, [gameId]);
            return null;
        } catch(error){
            console.error(error);
        } finally {
            if (conn){
                conn.release();
            }
        }
    }

    updateGame = async(gameId, title, publisher, year) => {
        let conn;
        try {
            conn = await pool.getConnection();
            const sql = 'UPDATE games SET title = ?, publisher = ?, year = ? WHERE id = ?';
            await conn.query(sql, [title, publisher, year, gameId]);
            return this.getGameDetail(gameId);
        } catch (error){
            console.error(error);
        } finally {
            if(conn){
                conn.release();
            }
        }
    }
}

module.exports = new Game();