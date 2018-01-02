var mysql = require('mysql');  
var connection = mysql.createPool({  
    host: process.env.DB_HOST,  
    user: process.env.DB_USER,  
    password: process.env.DB_PASS,  
    database: 'test'  
});  
console.log('MySQL db is now connected');
module.exports = connection;  