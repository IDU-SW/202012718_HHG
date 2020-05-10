const mysql = require('mysql2');
const fs = require('fs');

// DB Connection
const dbConfig = {
    host: 'localhost',
    user: 'dev',
    password: 'secret',
    port: 3306,
    database: 'games',
    multipleStatements: true,
 };

// Connection Pool module export
const pool = mysql.createPool(dbConfig).promise();
module.exports = pool;