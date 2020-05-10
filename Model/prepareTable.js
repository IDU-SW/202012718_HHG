const conn = require('./dbConnection');

exports.prepareTable = () => {
    const sql = 'drop table if exists games.games; CREATE TABLE games.games ( id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(20), publisher VARCHAR(30), year INT););';
    conn.query(sql).then(ret => {
        console.log('Succees');
        conn.end();
    }).catch(err => {
        console.log('Fail :', err);
        conn.end();
    });
}