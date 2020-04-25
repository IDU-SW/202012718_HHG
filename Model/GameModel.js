const fs = require('fs');

class Game {
    constructor() {
        const data = fs.readFileSync('./model/data.json');
        this.games = JSON.parse(data)
    }

    // Promise 예제
    getGameList() {
        if (this.games) {
            return this.games;
        }
        else {
            return [];
        }
    }

    addGame(title, publisher, year) {
        return new Promise((resolve, reject) => {
            let last = this.games[this.games.length - 1];
            let id = last.id + 1;

            let newGame = {id, title, publisher, year};
            this.games.push(newGame);

            resolve(newGame);
        });
    }

    // Promise - Reject
    getGameDetail(gameId) {
        return new Promise((resolve, reject) => {
            for (var game of this.games ) {
                if ( game.id == gameId ) {
                    resolve(game);
                    return;
                }
            }
            reject({msg:'Can not find game', code:404});
        });
    }

    deleteGame(gameId) {
        return new Promise((resolve, reject) => {
            let cnt = 0;
            for (var game of this.games ) {
                if ( game.id == gameId ) {
                    this.games.splice(cnt, 1);
                    resolve(game);
                    return;
                }
                cnt+=1;
            }
            reject({msg:'Can not find game', code:404});
        });
    }

    updateGame(gameId, title, publisher, year){
        return new Promise((resolve, reject) => {
            for (var game of this.games ) {
                if ( game.id == gameId ) {
                    game.title = title;
                    game.publisher = publisher;
                    game.year = year;

                    resolve(game);
                    return;
                }
            }
            reject({msg:'Can not find game', code:404});
        });
    }
}

module.exports = new Game();