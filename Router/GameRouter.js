const express = require('express');
const router = express.Router();
const games = require('../model/GameModel');

router.get('/games', showGameList);
router.get('/games/:gameId', showGameDetail);
router.post('/games', addGame);
router.put('/games', updateGame);
router.delete('/games', deleteGame);

module.exports = router;

function showGameList(req, res) {
    const gameList = games.getGameList();
    const result = { data:gameList, count:gameList.length };
    res.send(result);
};


// Async-await를 이용하기
async function showGameDetail(req, res) {
    try {
        // 게임 상세 정보 Id
        const gameId = req.params.gameId;
        console.log('gameId : ', gameId);
        const info = await games.getGameDetail(gameId);
        res.send(info);
    }
    catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}


// 새 게임 추가
// POST 요청 분석 -> 바디 파서
async function addGame(req, res) {
    const title = req.body.title;

    if (!title) {
        res.status(400).send({error:'title 누락'});
        return;
    }

    const publisher = req.body.publisher;
    const year = parseInt(req.body.year);

    try {
        const result = await games.addGame(title, publisher, year);
        res.send({msg:'success', data:result});
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}

async function updateGame(req, res) {
    const title = req.body.title;
    const id = req.body.id;

    if (!title) {
        res.status(400).send({error:'title 누락'});
        return;
    } else if (!id) {
        res.status(400).send({error:'id 누락'});
        return;
    }

    const publisher = req.body.publisher;
    const year = parseInt(req.body.year);

    try {
        const result = await games.updateGame(id, title, publisher, year);
        res.send({msg:'success', data:result});
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}

// 새 게임 삭제
// DELETE 요청 분석 -> 바디 파서
async function deleteGame(req, res) {
    try {
        // 게임 상세 정보 Id
        const gameId = req.body.id;
        console.log('gameId : ', gameId);
        const info = await games.deleteGame(gameId);
        res.send('Delete Success, 200');
    }
    catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}