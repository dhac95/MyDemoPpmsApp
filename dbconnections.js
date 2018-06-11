var mysql = require('mysql');
var proxyMysqlDeadlockRetries = require('node-mysql-deadlock-retries');

var db_config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
};

var connection;

function handleDisconnect() {
    connection = mysql.createPool(db_config); // Recreate the connection, since
    // the old one cannot be reused.

    connection.getConnection(function (err, connection) { // The server is either down
        if (err) { // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        } // to avoid a hot loop, and to allow our node script to
    }); // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    connection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect(); // lost due to either server restart, or a
        } else { // connnection idle timeout (the wait_timeout
            throw err; // server variable configures this)
        }
    });


}

handleDisconnect();

// var connection = mysql.createPool({  
//     host: process.env.DB_HOST,  
//     user: process.env.DB_USER,  
//     password: process.env.DB_PASS,  
//     database: 'test'  
// });  
// connection.connect(function(err) {
//     if (err) throw err;
//     console.log('MySQL db is now connected! ');
// });

var retries = 5; // How many times will the query be retried when the ER_LOCK_DEADLOCK error occurs
var minMillis = 1; // The minimum amount of milliseconds that the system sleeps before retrying
var maxMillis = 100; // The maximum amount of milliseconds that the system sleeps before retrying
var debug = 1; // Show all the debugs on how the proxy is working
var show_all_errors = 1; // Show all errors that are outside of the proxy


connection.on('connection', function (connection) {
    proxyMysqlDeadlockRetries(connection, retries, minMillis, maxMillis, debug, show_all_errors);
});

console.log('MySQL db is now connected');
module.exports = connection;