var mysql = require('mysql');  
var proxyMysqlDeadlockRetries = require('node-mysql-deadlock-retries');

var connection = mysql.createPool({  
    host: process.env.DB_HOST,  
    user: process.env.DB_USER,  
    password: process.env.DB_PASS,  
    database: 'test'  
});  
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
