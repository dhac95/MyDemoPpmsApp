var mysql = require('mysql');  
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

console.log('MySQL db is now connected');
module.exports = connection;  
