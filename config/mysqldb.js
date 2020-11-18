// standard DB connection
const util = require('util');
const moment = require('moment-timezone');
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: process.env.APP_POOL_LIMIT,
    host: process.env.APP_DB_HOST,
    port: process.env.APP_MYSQL_PORT,
    database: process.env.APP_DB,
    user: process.env.APP_DB_USER,
    password: process.env.APP_DB_PASS,
    multipleStatements: true
})

// DB pool connect/disconnect handler
function handleConnection() {
    pool.getConnection((err, connection) => {
        if (err) {
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.error('[MYSQL] => Database connection was closed at' + moment().format('YYYY-MM-DD HH:mm') + "\n" + err);
            }
            if (err.code === 'ER_CON_COUNT_ERROR') {
                console.error('[MYSQL] => Database has too many connections at' + moment().format('YYYY-MM-DD HH:mm') + "\n" + err);
            }
            if (err.code === 'ECONNREFUSED') {
                console.error('[MYSQL] => Database connection was refused at' + moment().format('YYYY-MM-DD HH:mm') + "\n" + err);
            }
            handleConnection();
        }
        if (connection) {
            console.error('[MYSQL] => Connected at', moment().format('YYYY-MM-DD HH:mm'));
            connection.release();
        }
        return
    })
}
handleConnection();

// promisify for node async/await.
pool.query = util.promisify(pool.query)

// export pool
module.exports = pool;
