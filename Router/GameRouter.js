const jwt = require('jsonwebtoken'); //인증토큰
const express = require('express');
const router = express.Router();
const games = require('../model/GameModel');

router.post('/login', handleLogin);
router.get('/profile', sendProfile);
router.get('/public', sendPublicInfo);

router.get('/games', showGameList);
router.get('/games/:gameId', showGameDetail);
router.post('/games', addGame);
router.put('/games', updateGame);
router.delete('/games', deleteGame);

module.exports = router;


const secretKey = '202012718'

const user = {
    id : 'hgHong',
    password : 'cometure',
    name : '홍현교'
 }

function handleLogin(req, res) {
    const id = req.body.id;
    const pw = req.body.password;
 
    // 로그인 성공
    if ( id === user.id && pw === user.password ) {
       // 토큰 생성
       const token = jwt.sign( { id:user.id, name:user.name }, secretKey );
       res.send({msg:'success', token:token});
    }
    else {
       res.sendStatus(401);
    }
 }
 
 function sendPublicInfo(req, res) {
    res.send({msg : 'This is public information'});
 }
 
 // 프로필 보기 - 인증된 사용자만 가능
 function sendProfile(req, res) {
    // 요청 헤더 중 Authorization 필드로 토큰 얻기
    const token = req.headers['authorization'];
    console.log('token :', token);
    jwt.verify(token, secretKey, (err, decoded) => {
       if ( err ) {
          res.sendStatus(401);
          return;
       }
       res.send({id: user.id, name: user.name});
    }); 
 }


async function showGameList(req, res) {
    const gameList = await games.getGameList();
    const result = { data:gameList, count:gameList.length };
    const token = req.headers['authorization'];
    
    jwt.verify(token, secretKey, (err, decoded) => {
        if(err){
            res.sendStatus(401);
            return; 
        }
        res.send(result);
    });
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